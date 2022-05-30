import { observer } from 'mobx-react';
import {
    useEffect,
    useRef,
    useImperativeHandle,
    forwardRef,
    useState,
} from 'react';
import { TCurrentBook } from '../../../store/LibraryStore';
import { Document } from 'react-pdf/dist/esm/entry.webpack';
import { getClientSize, pdfTextToObjectUrl } from '../../../utils/common';
import styled from 'styled-components';
import './PdfTextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { OutlineMenu } from './OutlineMenu';
import FastPages from './FramesPages';

const DocumentIS = styled(Document)`
    overflow: hidden;
`;

type TPDFReaderProps = {
    book: TCurrentBook;
    pageNumber: number;
    mode: string;
    onBookLoaded: (numPages: number) => {};
    onPageChange: (page: number) => {};
};

function PDFReader(
    { book, pageNumber, onPageChange, onBookLoaded, mode }: TPDFReaderProps,
    ref,
) {
    const pageCount = useRef(book.card.pageCount);
    const ratio = useRef(book.card.ratio || 1.5);
    const bookFileURI = pdfTextToObjectUrl(book.text);
    const textContainerRef = useRef(null);
    const iref = useRef();

    const onDocumentLoadSuccess = (props: { numPages: number }) => {
        const { numPages } = props;
        onBookLoaded && onBookLoaded(numPages);
    };

    const handleLoadSuccess = () => {
        iref.current.setPageNumber(pageNumber);
    };

    const onTableOfContentItemClick = ({ pageIndex, pageNumber }) => {
        onPageChange(pageNumber);
        iref.current.setPageNumber(pageNumber);
    };

    const tableOfContentsRef = useRef();
    useImperativeHandle(ref, () => ({
        toggleTableOfContents: () => {
            tableOfContentsRef.current.toggleTableOfContents();
        },
    }));

    const { width: clientWidth } = getClientSize();
    const [pageWidth, setPageWidth] = useState(clientWidth);
    useEffect(() => {
        const fitPageSize = () => {
            const { width, height } = getClientSize();
            setPageWidth(width);
        };

        window.addEventListener('resize', fitPageSize);
        return () => window.removeEventListener('resize', fitPageSize);
    }, []);
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
                    <FastPages
                        ref={iref}
                        mode={mode}
                        pageCount={pageCount.current}
                        pageRatio={ratio.current}
                        pageWidth={pageWidth}
                        pageNumber={pageNumber}
                        onPageChange={onPageChange}
                        onLoadSuccess={handleLoadSuccess}
                    />
                </DocumentIS>
            )}
        </>
    );
}

export default observer(forwardRef(PDFReader));
