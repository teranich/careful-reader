import { observer } from 'mobx-react';
import {
    useContext,
    useEffect,
    useMemo,
    useCallback,
    useRef,
    createRef,
    useImperativeHandle,
    forwardRef,
    useState,
    memo,
} from 'react';
import { TCurrentBook } from '../../store/LibraryStore';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { getClientSize, pdfTextToObjectUrl } from '../../utils/common';
import styled from 'styled-components';
import { usePagesManager, useSingle } from './Readers.utils';
import { stylize, stylizeJSX } from '../../utils/styler';
import { Hightlighter } from './Hightlighter';
import { RootStoreContext } from '../../store/RootStore';
import BackgroundImage from './page2.jpg';
import './PdfTextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { v4 as uuid } from 'uuid';

const opacity = `
.page canvas, .page svg {
    opacity: 0.1;
}`;
const DocumentIS = styled(Document)`
    overflow: hidden;
    ${(props) => props.wordsHighlight && opacity}
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

export default observer(function PDFReader({
    book,
    oldPageNumber,
    onPageChange,
    onBookLoaded,
    mode,
}: TPDFReaderProps) {
    const pageCount = book.card.pageCount;
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
    const { wordsHighlight } = appStore;
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

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
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

    useEffect(() => {
        window.addEventListener('resize', fitPageSize);
        return () => window.removeEventListener('resize', fitPageSize);
    }, []);


    return (
        <Hightlighter wordsHighlight={true}>
            {bookFileURI && (
                <DocumentIS
                    ref={textContainerRef}
                    file={bookFileURI}
                    onLoadSuccess={onDocumentLoadSuccess}
                    // renderMode="svg"
                    wordsHighlight={wordsHighlight}
                    options={{
                        cMapUrl: 'cmaps/',
                        cMapPacked: true,
                    }}
                >
                    {mode === 'one' && (
                        <OnePage
                            pageNumber={getCurrentPageNumber()}
                            pageSize={pageSize}
                            onLoadSuccess={onPageLoadSuccess}
                        />
                    )}
                    {mode === 'all' && (
                        <AllPages
                            pageCount={pageCount}
                            pageSize={pageSize}
                            onLoadSuccess={onPageLoadSuccess}
                        />
                    )}
                    {mode === 'greed' && (
                        <MemoFramesPagesWithRef
                            ref={iref}
                            pageSize={pageSize}
                            initialPageNumber={getCurrentPageNumber()}
                            pageCount={pageCount}
                            wordsHighlight={wordsHighlight}
                            onLoadSuccess={onPageLoadSuccess}
                        />
                    )}
                </DocumentIS>
            )}
        </Hightlighter>
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
    height: ${(props) => props.width * 1.5}px;
    border: 1px solid black;
    position: relative;
`;
const PageContaierIS = styled.div`
    position: absolute;
`;

const DummyPages = (
    {
        wordsHighlight,
        pageSize,
        pageCount,
        onLoadSuccess,
        initialPageNumber,
    }: TDummyPagesProps,
    outputRef,
) => {
    const [pageNumber, setPageNumber] = useState(initialPageNumber);
    const pageManager = usePagesManager([initialPageNumber], pageCount);
    useImperativeHandle(outputRef, () => ({
        setPageNumber: (page) => {
            pageManager.goToPage(page);
        },
    }));
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

    const customTextRenderer = useCallback(
        ({ str }) => (wordsHighlight ? stylizeJSX(str) : str),
        [],
    );

    const pages = Array(pageCount).fill(0);

    return (
        <>
            {pages.map((_, i) => (
                <DummyPageIS
                    ref={refs[i]}
                    key={`pdf-page-${i}`}
                    data-page-number={i + 1}
                    width={pageSize.width}
                >
                    {pageManager.pages.includes(i + 1) && (
                        <PageIS
                            key={`pdf-page-${i}`}
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
};

const AllPages = ({
    pageNumber,
    pageCount,
    pageSize,
    onLoadSuccess,
}: TAllPagesComponent) => {
    const loadSuccessHandler = () => {};
    return (
        <>
            {Array(pageCount)
                .fill(0)
                .map((_, i) => (
                    <PageIS
                        key={`pdf-page-${i}`}
                        pageNumber={i + 1}
                        width={pageSize.width}
                        height={pageSize.height}
                        onLoadSuccess={loadSuccessHandler}
                    />
                ))}
        </>
    );
};
