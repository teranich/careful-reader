import {
    createRef,
    forwardRef,
    memo,
    useEffect,
    useImperativeHandle,
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
    pageNumber,
    pageCount,
    pageSize,
    onLoadSuccess,
    pageRatio,
}: TAllPagesComponent) => {
    const loadSuccessHandler = () => {};
    useEffect(() => {}, []);

    return (
        <>
            {Array(pageCount)
                .fill(0)
                .map((_, i) => (
                    <DummyPageIS
                        ref={refs[i]}
                        key={`pdf-page-${i}`}
                        data-page-number={i + 1}
                        width={pageSize.width}
                        height={pageSize.width * pageRatio}
                    >
                        <PageIS
                            key={`pdf-page-${i}`}
                            ref={refs[i]}
                            pageNumber={i + 1}
                            width={pageSize.width}
                            height={pageSize.height}
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
            initialPageNumber,
            pageRatio,
            onPageChange,
            onLoadSuccess,
        }: TDummyPagesProps,
        outputRef,
    ) => {
        const [pageNumber, setPageNumber] = useState(initialPageNumber);
        const pageManager = usePagesManager([initialPageNumber], pageCount);
        const [ignore, setIgnore] = useState(false);
        const pages = Array(pageCount).fill(0);
        const [height, setHeight] = useState(pageSize.width * pageRatio);

        // const pageHeight = pageSize.width * pageRatio;
        const [refs, setRefs] = useState([]);
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
                onPageChange && onPageChange(currentPage);
            };
            document.addEventListener('scroll', listener);
            onLoadSuccess && onLoadSuccess();
            return () => {
                document.removeEventListener('scroll', listener);
            };
        }, []);

        useEffect(() => {
            refs.length > 0 && onLoadSuccess && onLoadSuccess(refs);
        }, [refs.length]);

        useImperativeHandle(outputRef, () => ({
            setPageNumber: (page) => {
                pageManager.goToPage(page);
                console.log('pageManager', pageManager.pages);
            },
        }));

        return (
            <>
                {pages.map((_, i) => (
                    <DummyPageIS
                        ref={refs[i]}
                        key={`pdf-page-${i}`}
                        data-page-number={i + 1}
                        width={pageSize.width}
                        height={height}
                    >
                        {pageManager.pages.includes(i + 1) && (
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

export default memo(forwardRef(FastPages));
