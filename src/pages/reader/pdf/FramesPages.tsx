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
import { debounce } from 'lodash';

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

const scrollToPage = (page: number) => {
    const target = document.querySelector(`[data-page-number="${page}"`);

    target?.scrollIntoView();
};

const getCurrentPage = (heights, scrollPosition) => {
    let acc = 0;
    for (let page in heights) {
        const height = heights[page];
        acc += height;
        if (acc >= scrollPosition) return parseInt(page, 10);
    }
    return 0;
};

const customTextRenderer = ({ str }) => stylizeJSX(str);
const FramesPages = forwardRef(
    (
        {
            pageWidth,
            pageCount,
            pageRatio,
            onPageChange,
            onLoadSuccess,
            pageNumber,
        }: TDummyPagesProps,
        outputRef,
    ) => {
        // const pageNumber = 0;
        const pageManager = usePagesManager([pageNumber.current], pageCount);
        const allPages = useRef(Array(pageCount).fill(0));
        const descriptionHeight = pageWidth * pageRatio;
        const heightMap = useRef(Array(pageCount).fill(descriptionHeight));

        const [pages, setPages] = useState(pageManager.pages());
        const lastPage = useRef(pageNumber.current);
        useEffect(() => {
            const listener = debounce(() => {
                const currentPage = getCurrentPage(
                    heightMap.current,
                    window.scrollY,
                );
                // console.log(
                //     'current page',
                //     currentPage,
                //     lastPage.current,
                //     window.scrollY,
                //     pageCount,
                //     heightMap,
                // );
                if (lastPage.current !== currentPage) {
                    onPageChange && onPageChange(currentPage);
                    lastPage.current = currentPage;
                    pageManager.goToPage(currentPage);
                    setPages(pageManager.pages());
                    console.log('pageManager', pageManager.pages());
                }
            }, 200);
            document.addEventListener('scroll', listener);
            return () => {
                document.removeEventListener('scroll', listener);
            };
        }, []);

        useImperativeHandle(outputRef, () => ({
            setPageNumber: (page) => {
                pageManager.goToPage(page);
            },
            gotoLastPage: () => {
                console.log('last page', lastPage.current);
                scrollToPage(lastPage.current);
            },
        }));
        useEffect(() => {
            console.count('USE EFFECT []', pageNumber.current);
            // onLoadSuccess && onLoadSuccess();
            setTimeout(() => {
                scrollToPage(pageNumber.current + 1);
            }, 100);
        }, []);
        console.count('RENDER');
        return (
            <>
                {allPages.current.map((_, i) =>
                    pages.includes(i + 1) ? (
                        <PageIS
                            key={`pdf-page-${i}`}
                            className="page"
                            pageNumber={i + 1}
                            onLoadSuccess={(p) => {
                                heightMap.current[i] = p.height;
                            }}
                            width={pageWidth}
                            renderMode="svg"
                            customTextRenderer={customTextRenderer}
                        />
                    ) : (
                        <DummyPageIS
                            key={`pdf-page-${i}`}
                            data-page-number={i + 1}
                            width={pageWidth}
                            height={heightMap.current[i]}
                        />
                    ),
                )}
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

export default memo(forwardRef(FastPages));
