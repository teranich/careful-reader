import { observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import { TCurrentBook } from '../../store/LibraryStore';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { getClientSize, pdfTextToObjectUrl } from '../../utils/common';
import styled from 'styled-components';
import { usePagesManager } from './Readers.utils';

const DocumentIS = styled(Document)`
    pointer-events: none;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`;

const PDFReaderContainerIS = styled.div`
    overflow: hidden;
`;

export default observer(function PDFReader({
    book,
    onPageChange,
    onBookLoaded,
    mode,
}: {
    book: TCurrentBook;
    mode: string;
    onBookLoaded: (numPages: number) => {};
    onPageChange: (page: number) => {};
}) {
    const [pageCount, setPageCount] = useState(0);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [bookFileURI, setBookFileURI] = useState<string | undefined>();
    const { width: clientWidth, height: clientHeight } = getClientSize();
    const [pageWidth, setPageWidth] = useState(clientWidth);
    const [pageHeight, setPageHeight] = useState(clientHeight);
    const [actualPageHeight, setActualPageHeight] = useState(clientHeight);
    const textContainerRef = useRef(null);
    const onePageMode = false;
    const pageSize = { width: pageWidth, height: pageHeight };
    const { pages, goToPage, prev, next } = usePagesManager([1], 100);

    const handleScroll = () => {
        const scrollContainer = window;
        const pageMiddle = actualPageHeight / 2;
        const page = Math.round(
            (window.scrollY + pageMiddle) / actualPageHeight,
        );
        const triggerScroll =
            document.body.clientHeight - window.innerHeight - window.scrollY;

        if (triggerScroll < actualPageHeight * 2) {
            next();
        }

        if (window.scrollY === 0) {
            prev();
        }

        setCurrentPageNumber(page);
        onPageChange(page);
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setPageCount(numPages);
        onBookLoaded && onBookLoaded(numPages);
    };

    const changePage = (offset: number) => {
        setCurrentPageNumber((prevPageNumber) => prevPageNumber + offset);
        onPageChange(currentPageNumber);
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

    const onLoadSuccess = (pdfDocument: any) => {
        const { height } = pdfDocument;
        setActualPageHeight(height);
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

    return (
        <>
            <PDFReaderContainerIS ref={textContainerRef}>
                {bookFileURI && (
                    <>
                        <DocumentIS
                            file={bookFileURI}
                            onLoadSuccess={onDocumentLoadSuccess}
                            // renderMode="svg"
                            options={{
                                cMapUrl: 'cmaps/',
                                cMapPacked: true,
                            }}
                        >
                            {mode === 'one' && (
                                <OnePage
                                    pageNumber={currentPageNumber}
                                    pageSize={pageSize}
                                    onLoadSuccess={onLoadSuccess}
                                />
                            )}
                            {mode === 'all' && (
                                <AllPages
                                    pageCount={pageCount}
                                    pageSize={pageSize}
                                    onLoadSuccess={onLoadSuccess}
                                />
                            )}
                            {mode === 'greed' && (
                                <InFramePages
                                    pages={pages}
                                    pageSize={pageSize}
                                    onLoadSuccess={onLoadSuccess}
                                />
                            )}
                        </DocumentIS>
                    </>
                )}
            </PDFReaderContainerIS>
        </>
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
};

const InFramePages = ({
    pages = [],
    pageNumber,
    pageSize,
    onLoadSuccess,
}: TInFramePagesComponent) => {
    return pages.map((number) => (
        <>
            <PageIS
                key={`pdf-page-${number}`}
                pageNumber={number}
                width={pageSize.width}
                height={pageSize.height}
                onLoadSuccess={onLoadSuccess}
            />
        </>
    ));
};
