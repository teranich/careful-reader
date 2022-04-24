import { observer } from 'mobx-react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TCurrentBook } from '../../store/LibraryStore';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { getClientSize, pdfTextToObjectUrl } from '../../utils/common';
import styled from 'styled-components';
import { usePagesManager, useSingle } from './Readers.utils';
import { stylize, stylizeJSX } from '../../utils/styler';
import { Hightlighter } from './Hightlighter';
import { RootStoreContext } from '../../store/RootStore';
import BackgroundImage from './page2.jpg';

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
    const pageManager = usePagesManager([oldPageNumber], 100);
    const { appStore, libraryStore } = useContext(RootStoreContext);
    const { wordsHighlight } = appStore;
    console.count('PDFReader');
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
        if (book.text) {
            // setBookFileURI(pdfTextToObjectUrl(bookText));
            window.addEventListener('scroll', handleScroll);

            return () => {
                return window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [book.text]);

    useEffect(() => {
        window.addEventListener('resize', fitPageSize);

        return () => window.removeEventListener('resize', fitPageSize);
    }, []);

    const customTextRenderer = ({ str }) =>
        wordsHighlight ? stylizeJSX(str) : str;
    console.count();
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
                            pageCount={pageCount}
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

const DummyPageIS = styled.div`
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    border: 1px solid black;
`;

const InFramePages = ({
    pages = [],
    pageNumber,
    pageSize,
    pageCount,
    customTextRenderer,
    onLoadSuccess,
}: TInFramePagesComponent) => {
    // ${(props) => props.wordsHighlight && opacity}


    console.log('inframes', pages.length, pages);

    return (
        <>
            {Array(pageCount)
                .fill(0)
                .map((_, i) => (
                    <DummyPageIS
                        key={`pdf-page-${i}`}
                        data-page-number={i}
                        width={pageSize.width}
                        height={pageSize.height}
                    >{i}</DummyPageIS>
                ))}
        </>
    );
};

// <PageIS
//         key={`pdf-page-${i}`}
//         className="page"
//         pageNumber={i}
//         width={pageSize.width}
//         height={pageSize.height}
//         renderMode="svg"
//         onLoadSuccess={onLoadSuccess}
//         // customTextRenderer={customTextRenderer}
//     />
