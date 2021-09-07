import { observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import { TCurrentBook } from '../../store/LibraryStore';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { pdfTextToObjectUrl } from '../../utils/common';

export default observer(function PDFReader({ book }: { book: TCurrentBook }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [file, setFile] = useState<string | undefined>();

    useEffect(() => {
        if (book?.text) setFile(pdfTextToObjectUrl(book?.text));
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
        <div className="pdfReader">
            {file && (
                <>
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page pageNumber={1} />
                        {/* {Array.from(new Array(numPages), (el, index) => (
                            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))} */}
                    </Document>
                </>
            )}
        </div>
    );
});
