import { observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import { TCurrentBook } from '../../store/LibraryStore';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { getClientSize, pdfTextToObjectUrl } from '../../utils/common';
import styled from 'styled-components';

const DocumentIS = styled(Document)`
    pointer-events: none;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`;
const PageIS = styled(Page)``;

const PDFReaderContainerIS = styled.div``;

export default observer(function PDFReader({
    book,
    onPageChange,
    onBookLoaded,
}: {
    book: TCurrentBook;
}) {
    const [pageCount, setPageCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [file, setFile] = useState<string | undefined>();
    const { width: clientWidth, height: clientHeiht } = getClientSize();
    const [pageWidth, setPageWidth] = useState(clientWidth);
    const [pageHeight, setPageHeight] = useState(clientHeiht);
    const onePageMode = false;

    useEffect(() => {
        if (book?.text) {
            setFile(pdfTextToObjectUrl(book.text));
        }
    }, [book?.text]);
    function onDocumentLoadSuccess({ numPages }) {
        setPageCount(numPages);
        onBookLoaded && onBookLoaded(numPages);
    }
    function changePage(offset) {
        setPageNumber((prevPageNumber) => prevPageNumber + offset);
        onPageChange(pageNumber);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    const fitPageSize = () => {
        const { width, height } = getClientSize();
        setPageWidth(width);
    };
    const pageSize = { width: pageWidth, height: pageHeight };

    return (
        <PDFReaderContainerIS>
            {file && (
                <>
                    <DocumentIS
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        // renderMode="svg"
                        options={{
                            cMapUrl: 'cmaps/',
                            cMapPacked: true,
                        }}
                    >
                        {onePageMode ? (
                            <OnePage
                                pageNumber={pageNumber}
                                pageSize={pageSize}
                            />
                        ) : (
                            <AllPages
                                pageCount={pageCount}
                                pageSize={pageSize}
                            />
                        )}
                    </DocumentIS>
                </>
            )}
        </PDFReaderContainerIS>
    );
});

const OnePage = ({ pageNumber, pageSize }) => {
    return (
        <>
            <PageIS
                pageNumber={pageNumber}
                width={pageSize.width}
                height={pageSize.height}
            />
        </>
    );
};

const AllPages = ({ pageCount, pageSize }) => {
    console.log(pageCount, pageSize);
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
                    />
                ))}
        </>
    );
};
