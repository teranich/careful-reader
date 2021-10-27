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
`;
const PageIS = styled(Page)``;

const PDFReaderContainerIS = styled.div``;

export default observer(function PDFReader({ book }: { book: TCurrentBook }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [file, setFile] = useState<string | undefined>();
    const [pageWidth, setPageWidth] = useState(600);
    const [pageHeight, setPageHeight] = useState(600);

    useEffect(() => {
        if (book?.text) {
            setFile(pdfTextToObjectUrl(book.text));
        }
    }, [book?.text]);
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    function changePage(offset) {
        setPageNumber((prevPageNumber) => prevPageNumber + offset);
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

    return (
        <PDFReaderContainerIS>
            {file && (
                <>
                    <button onClick={nextPage}>next</button>
                    <button onClick={previousPage}>prev</button>
                    <button onClick={fitPageSize}>fit</button>

                    <DocumentIS
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        // renderMode="svg"
                        options={{
                            cMapUrl: 'cmaps/',
                            cMapPacked: true,
                        }}
                    >
                        <PageIS pageNumber={pageNumber} width={pageWidth} height={pageHeight} />
                        {/* {Array.from(new Array(numPages), (el, index) => (
                            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))} */}
                    </DocumentIS>
                </>
            )}
        </PDFReaderContainerIS>
    );
});
