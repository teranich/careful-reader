import { observer } from 'mobx-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { TCurrentBook } from '../../store/LibraryStore';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { getClientSize, pdfTextToObjectUrl } from '../../utils/common';
import styled from 'styled-components';
import { usePagesManager, useSingle } from './Readers.utils';
import { stylize, stylizeJSX } from '../../utils/styler';
import { Hightlighter } from './Hightlighter';
import { RootStoreContext } from '../../store/RootStore';

const opacity = `
.page canvas {
    opacity: 0;
}`
const DocumentIS = styled(Document)`
    overflow: hidden;
    ${(props) => props.wordsHighlight && opacity}

`;

const scrollToPage = (page: number) => {
    const target = document.querySelector(`[data-page-number="${page}"`);
    target?.scrollIntoView();
};

export default observer(function PDFReader({
    book,
    oldPageNumber,
    onPageChange,
    onBookLoaded,
    mode,
}: {
    book: TCurrentBook;
    oldPageNumber: number;
    mode: string;
    onBookLoaded: (numPages: number) => {};
    onPageChange: (page: number) => {};
}) {
    const [pageCount, setPageCount] = useState(0);
    const [getCurrentPageNumber, setCurrentPageNumber] =
        useSingle<number>(oldPageNumber);
    const [bookFileURI, setBookFileURI] = useState<string | undefined>();
    const { width: clientWidth, height: clientHeight } = getClientSize();
    const [pageWidth, setPageWidth] = useState(clientWidth);
    const [pageHeight, setPageHeight] = useState(clientHeight);
    const [actualPageHeight, setActualPageHeight] = useState(clientHeight);
    const textContainerRef = useRef(null);
    const pageSize = { width: pageWidth, height: pageHeight };
    const pageManager = usePagesManager([oldPageNumber], 100);
    const { appStore, libraryStore } = useContext(RootStoreContext);
    const { wordsHighlight, dynamicTextOrientation } = appStore;

    const handleScroll = () => {
        const triggerScroll =
            document.body.clientHeight - window.innerHeight - window.scrollY;

        if (triggerScroll < actualPageHeight * 2) {
            pageManager.next();
        }

        if (window.scrollY === 0) {
            pageManager.prev();
        }
    };

    const handleIntersectionObserver = (pages) => {
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
            if (pageNumberInView !== getCurrentPageNumber()) {
                setCurrentPageNumber(pageNumberInView);
                onPageChange(getCurrentPageNumber());
            }
        };

        const observer = new IntersectionObserver(callback, options);

        pages.forEach((page) => {
            const target = document.querySelector(
                `[data-page-number="${page}"`,
            );

            target && observer?.observe(target);
        });
        return observer;
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setPageCount(numPages);
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
    const onPageLoadSuccess = (pdfDocument: any) => {
        const { height } = pdfDocument;
        setActualPageHeight(height);
        scrollToPage(getCurrentPageNumber());

        getOserver()?.disconnect();
        setObserver(handleIntersectionObserver(pageManager.pages));
    };

    useEffect(() => {
        if (book?.text) {
            setBookFileURI(pdfTextToObjectUrl(book.text));
            window.addEventListener('scroll', handleScroll);

            return () => {
                return window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [book?.text]);

    useEffect(() => {
        window.addEventListener('resize', fitPageSize);

        return () => window.removeEventListener('resize', fitPageSize);
    }, []);

    const customTextRenderer = ({ str }) => wordsHighlight ? stylizeJSX(str) : str;

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
                        <InFramePages
                            pages={pageManager.pages}
                            pageSize={pageSize}
                            onLoadSuccess={onPageLoadSuccess}
                            customTextRenderer={customTextRenderer}
                        />
                    )}
                </DocumentIS>
            )}
        </Hightlighter>
    );
});

const PageIS = styled(Page)`
    border: 1px solid black;
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
};

const AllPages = ({
    pageNumber,
    pageCount,
    pageSize,
    onLoadSuccess,
}: TAllPagesComponent) => {
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
                        onLoadSuccess={onLoadSuccess}
                    />
                ))}
        </>
    );
};

type TInFramePagesComponent = TPageComponent & {
    pageNumber: number;
    pageCount: number;
    pages: number[];
    customTextRenderer: () => any;
};

const InFramePages = ({
    pages = [],
    pageNumber,
    pageSize,
    customTextRenderer,
    onLoadSuccess,
}: TInFramePagesComponent) => (
    <>
        {pages.map((number) => (
            <PageIS
                className="page"
                key={`pdf-page-${number}`}
                pageNumber={number}
                width={pageSize.width}
                height={pageSize.height}
                onLoadSuccess={onLoadSuccess}
                customTextRenderer={customTextRenderer}
            />
        ))}
    </>
);
