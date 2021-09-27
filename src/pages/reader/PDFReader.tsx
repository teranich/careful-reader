import { observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import { TCurrentBook } from '../../store/LibraryStore';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { pdfTextToObjectUrl } from '../../utils/common';
import styled from 'styled-components';

const DocumentContainer = styled(Document)`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    color: transparent;
    transform: translate(-50%, -50%) rotate(0deg);
    pointer-events: none;
`;

export default observer(function PDFReader({ book }: { book: TCurrentBook }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [file, setFile] = useState<string | undefined>('./gita.pdf');

    useEffect(() => {
        if (book?.text) setFile(pdfTextToObjectUrl(book.text));
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
    return (
        <>
            {file && (
                <>
                    <button onClick={nextPage}>next</button>

                    <DocumentContainer
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        renderMode="svg"
                        options={{
                            cMapUrl: 'cmaps/',
                            cMapPacked: true,
                        }}
                    >
                        <Page pageNumber={pageNumber} width={600} />
                        {/* {Array.from(new Array(numPages), (el, index) => (
                            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))} */}
                    </DocumentContainer>
                </>
            )}
        </>
    );
});
