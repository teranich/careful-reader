import { observer } from 'mobx-react';
import {
    useContext,
    useEffect,
    useRef,
    createRef,
    useImperativeHandle,
    forwardRef,
    useState,
    memo,
} from 'react';
import { TCurrentBook } from '../../../store/LibraryStore';
import { Document, Page, Outline } from 'react-pdf/dist/esm/entry.webpack';
import { getClientSize, pdfTextToObjectUrl } from '../../../utils/common';
import styled from 'styled-components';
import { usePagesManager, useSingle } from './Readers.utils';
import { stylizeJSX } from '../../../utils/styler';
import { RootStoreContext } from '../../../store/RootStore';
import BackgroundImage from '../page2.jpg';
import './PdfTextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { getCurrentHeaderHeight } from '../../../components/common/Header';

const DocumentIS = styled(Document)`
    overflow: hidden;
`;

const scrollToPage = (page: number) => {
    const target = document.querySelector(`[data-page-number="${page}"`);
    target?.scrollIntoView();
};

type TPDFReaderProps = {
    book: TCurrentBook;
    oldPageNumber: number;
    mode: string;
    onBookLoaded: (numPages: number) => {};
    onPageChange: (page: number) => {};
};

function PDFReader(
    { book, oldPageNumber, onPageChange, onBookLoaded, mode }: TPDFReaderProps,
    ref,
) {
    const pageCount = useRef(book.card.pageCount);
    const ratio = useRef(book.card.ratio || 1.5);
    const [getCurrentPageNumber, setCurrentPageNumber] =
        useSingle<number>(oldPageNumber);
    const bookFileURI = pdfTextToObjectUrl(book.text);
    const { width: clientWidth, height: clientHeight } = getClientSize();
    const [pageWidth, setPageWidth] = useState(clientWidth);
    const [pageHeight, setPageHeight] = useState(clientHeight);
    const [actualPageHeight, setActualPageHeight] = useState(clientHeight);
    const textContainerRef = useRef(null);
    const pageSize = { width: pageWidth, height: pageHeight };
    const { appStore, libraryStore } = useContext(RootStoreContext);
    const [cpage, setCpage] = useState(oldPageNumber);
    const iref = useRef();

    const handleIntersectionObserver = (elements = []) => {
        const options = {
            root: null,
            threshold: 0.5,
        };
        const callback = (entries, observer) => {
            const { target, isIntersecting } = entries[0];

            if (!isIntersecting) return null;
            const pageNumberInView = Number(
                target?.getAttribute('data-page-number'),
            );
            const currentPage = getCurrentPageNumber();
            console.log('itercepter', pageNumberInView, currentPage);
            if (pageNumberInView !== currentPage) {
                iref.current.setPageNumber(pageNumberInView);
                setCurrentPageNumber(pageNumberInView);
                onPageChange(pageNumberInView);
            }
        };

        const observer = new IntersectionObserver(callback, options);

        for (let target of elements) {
            if (target?.current) {
                observer?.observe(target.current);
            }
        }
        return observer;
    };

    const onDocumentLoadSuccess = (props: { numPages: number }) => {
        const { numPages } = props;
        onBookLoaded && onBookLoaded(numPages);
    };

    const changePage = (offset: number) => {
        setCurrentPageNumber(getCurrentPageNumber() + offset);
        onPageChange(getCurrentPageNumber());
    };

    const previousPage = () => {
        changePage(-1);
    };

    const nextPage = () => {
        changePage(1);
    };

    const fitPageSize = () => {
        const { width, height } = getClientSize();
        setPageWidth(width);
    };

    const [getOserver, setObserver] = useSingle<any>();

    const onPageLoadSuccess = (pageElements) => {
        getOserver()?.disconnect();
        setObserver(handleIntersectionObserver(pageElements));
        scrollToPage(getCurrentPageNumber());
    };

    const onTableOfContentItemClick = ({ pageIndex, pageNumber }) => {
        setCurrentPageNumber(pageNumber);
        onPageChange(getCurrentPageNumber());
        iref.current.setPageNumber(pageNumber);
        scrollToPage(getCurrentPageNumber());
    };

    useEffect(() => {
        window.addEventListener('resize', fitPageSize);
        return () => window.removeEventListener('resize', fitPageSize);
    }, []);

    const tableOfContentsRef = useRef();
    useImperativeHandle(ref, () => ({
        toggleTableOfContents: () => {
            tableOfContentsRef.current.toggleTableOfContents();
        },
    }));

    return (
        <>
            {bookFileURI && (
                <DocumentIS
                    ref={textContainerRef}
                    file={bookFileURI}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onItemClick={onTableOfContentItemClick}
                    options={{
                        cMapUrl: 'cmaps/',
                        cMapPacked: true,
                    }}
                >
                    <OutlineMenu
                        ref={tableOfContentsRef}
                        onItemClick={onTableOfContentItemClick}
                    />
                    {mode === 'one' && (
                        <OnePage
                            pageNumber={getCurrentPageNumber()}
                            pageSize={pageSize}
                        />
                    )}
                    {mode === 'all' && (
                        <AllPages
                            pageCount={pageCount.current}
                            pageSize={pageSize}
                            onLoadSuccess={onPageLoadSuccess}
                            pageRatio={ratio.current}
                        />
                    )}
                    {mode === 'greed' && (
                        <MemoFramesPagesWithRef
                            ref={iref}
                            pageSize={pageSize}
                            initialPageNumber={getCurrentPageNumber()}
                            pageCount={pageCount.current}
                            pageRatio={ratio.current}
                            onLoadSuccess={onPageLoadSuccess}
                        />
                    )}
                </DocumentIS>
            )}
        </>
    );
}
export default observer(forwardRef(PDFReader));

const OutlineIS = styled(Outline)`
    position: fixed;
    z-index: 2000;
    background-color: white;
    width: 100vw;
    overflow: auto;
    bottom: 0;
    top: ${getCurrentHeaderHeight()}px;
    padding: 10px;
    display: none;
    li a:hover {
        color: red;
    }
`;

const OutlineMenu = forwardRef(({ onItemClick }, ref) => {
    const tableOfContentsRef = useRef(false);

    const hideTableOfCpntents = () => {
        tableOfContentsRef.current.setAttribute('style', 'display:none;');
    };
    const showTableOfCpntents = () => {
        tableOfContentsRef.current.setAttribute('style', 'display:block;');
    };
    const toggleTableOfContents = () => {
        const { current } = tableOfContentsRef;
        const lastState = current.getAttribute('style') || 'display:none;';

        const actualState = lastState.includes('display:none')
            ? 'display:block;'
            : 'display:none;';
        current.setAttribute('style', actualState);
    };

    useImperativeHandle(ref, () => ({
        hideTableOfCpntents,
        showTableOfCpntents,
        toggleTableOfContents,
    }));

    return (
        <OutlineIS
            inputRef={tableOfContentsRef}
            onItemClick={({ pageIndex, pageNumber }) => {
                hideTableOfCpntents();
                return onItemClick({ pageIndex, pageNumber });
            }}
        />
    );
});

const PageIS = styled(Page)`
    border: 1px solid black;
    .react-pdf__Page__svg {
        background-image: url(${BackgroundImage});
        background-size: contain;
    }
`;

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

const DummyPages = (
    {
        pageSize,
        pageCount,
        onLoadSuccess,
        initialPageNumber,
        pageRatio,
    }: TDummyPagesProps,
    outputRef,
) => {
    const [pageNumber, setPageNumber] = useState(initialPageNumber);
    const pageManager = usePagesManager([initialPageNumber], pageCount);
    const [ignore, setIgnore] = useState(false);
    const customTextRenderer = ({ str }) => stylizeJSX(str);
    const pages = Array(pageCount).fill(0);
    const [height, setHeight] = useState();

    const [refs, setRefs] = useState([]);
    useEffect(() => {
        setRefs((ref) =>
            Array(pageCount)
                .fill()
                .map((_, i) => ref[i] || createRef()),
        );
    }, []);

    useEffect(
        () => {
            refs.length > 0 && onLoadSuccess && onLoadSuccess(refs)
        },
        [refs.length],
    );

    useImperativeHandle(outputRef, () => ({
        setPageNumber: (page) => {
            pageManager.goToPage(page);
            console.log('pageManager', pageManager.pages)
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
                    height={pageSize.width * pageRatio}
                >
                    {pageManager.pages.includes(i + 1) && (
                        <PageIS
                            key={`pdf-page-real-${i}`}
                            className="page"
                            pageNumber={i + 1}
                            width={pageSize.width}
                            renderMode="svg"
                            customTextRenderer={customTextRenderer}
                        />
                    )}
                </DummyPageIS>
            ))}
        </>
    );
};

const MemoFramesPagesWithRef = memo(forwardRef(DummyPages));

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
    pageRatio
}: TAllPagesComponent) => {
    const loadSuccessHandler = () => {};
    console.count('allPages');
    const [refs, setRefs] = useState([]);
    useEffect(() => {
        setRefs((ref) =>
            Array(pageCount)
                .fill()
                .map((_, i) => ref[i] || createRef()),
        );
    }, []);

    useEffect(
        () => refs.length > 0 && onLoadSuccess && onLoadSuccess(refs),
        [refs.length],
    );
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
