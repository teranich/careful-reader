import {
    createRef,
    forwardRef,
    memo,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import styled from 'styled-components';
import BackgroundImage from '../page2.jpg';
import { stylizeJSX } from '../../../utils/styler';
import { usePagesManager } from './Readers.utils';
import { Page } from 'react-pdf/dist/esm/entry.webpack';

const PageIS = styled(Page)`
    border: 1px solid black;
    .react-pdf__Page__svg {
        background-image: url(${BackgroundImage});
        background-size: contain;
    }
`;

type TPageComponent = {
    pageNumber: number;
    pageSize: { width: number; height: number };
    onLoadSuccess: () => {};
};

type TOnePageComponent = TPageComponent;

const OnePage = ({
    pageNumber,
    pageSize,
    onLoadSuccess,
}: TOnePageComponent) => {
    return (
        <>
            <PageIS
                pageNumber={pageNumber}
                width={pageSize.width}
                height={pageSize.height}
                onLoadSuccess={onLoadSuccess}
            />
        </>
    );
};

type TAllPagesComponent = TPageComponent & {
    pageNumber: number;
    pageCount: number;
    onLoadSuccess;
};

const AllPages = ({
    pageSize,
    pageCount,
    pageNumber,
    pageRatio,
    onPageChange,
    onLoadSuccess,
}: TAllPagesComponent) => {
    return (
        <>
            {Array(pageCount)
                .fill(0)
                .map((_, i) => (
                    <DummyPageIS
                        key={`pdf-page-${i}`}
                        data-page-number={i + 1}
                        width={pageSize.width}
                        height={pageSize.width * pageRatio}
                    >
                        <PageIS
                            key={`pdf-page-${i}`}
                            pageNumber={i + 1}
                            width={pageSize.width}
                            height={pageSize.height}
                            customTextRenderer={customTextRenderer}
                        />
                    </DummyPageIS>
                ))}
        </>
    );
};
type TDummyPagesProps = TPageComponent & {
    pageNumber: number;
    pageCount: number;
    pages: number[];
    customTextRenderer: () => any;
};

const DummyPageIS = styled.div`
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    border: 1px solid black;
    position: relative;
`;
const PageContaierIS = styled.div`
    position: absolute;
`;

const customTextRenderer = ({ str }) => stylizeJSX(str);
const FramesPages = forwardRef(
    (
        {
            pageSize,
            pageCount,
            pageNumber,
            pageRatio,
            onPageChange,
            onLoadSuccess,
        }: TDummyPagesProps,
        outputRef,
    ) => {
        const pageManager = usePagesManager(
            [pageNumber],
            pageCount,
        );
        const allPages = useRef(Array(pageCount).fill(0));
        const [height, setHeight] = useState(pageSize.width * pageRatio);

        const [pages, setPages] = useState(pageManager.pages());
        useEffect(() => {
            const listener = (e) => {
                const currentPage = Math.ceil(window.scrollY / height);
                console.log(
                    'current page',
                    currentPage,
                    window.scrollY,
                    height,
                    pageCount,
                );
                pageManager.goToPage(currentPage);
                setPages(pageManager.pages());
                console.log('pageManager', pageManager.pages());
                onPageChange && onPageChange(currentPage);
            };
            document.addEventListener('scroll', listener);
            onLoadSuccess && onLoadSuccess();
            return () => {
                document.removeEventListener('scroll', listener);
            };
        }, []);

        useImperativeHandle(outputRef, () => ({
            setPageNumber: (page) => {
                pageManager.goToPage(page);
            },
        }));

        return (
            <>
                {allPages.current.map((_, i) => (
                    <DummyPageIS
                        key={`pdf-page-${i}`}
                        data-page-number={i + 1}
                        width={pageSize.width}
                        height={height}
                    >
                        {pages.includes(i + 1) && (
                            <PageIS
                                key={`pdf-page-real-${i}`}
                                className="page"
                                pageNumber={i + 1}
                                onLoadSuccess={(p) => {
                                    console.log('loaded', height, p);
                                    if (p && p.height !== height) {
                                        console.warn('SET', p.height, height);
                                        setHeight(p.height);
                                    }
                                }}
                                width={pageSize.width}
                                renderMode="svg"
                                customTextRenderer={customTextRenderer}
                            />
                        )}
                    </DummyPageIS>
                ))}
            </>
        );
    },
);
const FramesPagesMemo = memo(FramesPages, () => {
    console.log('other memo');
    return true;
});
const FastPages = (props, ref) => {
    const { mode } = props;

    return (
        <>
            {mode === 'one' && <OnePage {...props} ref={ref} />}
            {mode === 'all' && <AllPages {...props} ref={ref} />}
            {mode === 'greed' && <FramesPages {...props} ref={ref} />}
        </>
    );
};

export default memo(forwardRef(FastPages), (o, n) => {
    console.log('o, n', o, n, o.pageNumber, n.pageNumber);
    console.log('inline-source-map', o.pageNumber !== n.pageNumber);
    // if (o.pageNumber !== n.pageNumber) return false;
    return true;
});
