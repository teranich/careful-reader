import { observer } from 'mobx-react';
import {
    useContext,
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
import { useSingle } from './Readers.utils';
import { RootStoreContext } from '../../../store/RootStore';
import './PdfTextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { OutlineMenu } from './OutlineMenu';
import FastPages from './FramesPages';

const DocumentIS = styled(Document)`
    overflow: hidden;
`;

const scrollToPage = (page: number) => {
    const target = document.querySelector(`[data-page-number="${page}"`);
    target?.scrollIntoView();
};

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
    const { width: clientWidth, height: clientHeight } = getClientSize();
    const [pageWidth, setPageWidth] = useState(clientWidth);
    const [pageHeight, setPageHeight] = useState(clientHeight);
    const [actualPageHeight, setActualPageHeight] = useState(clientHeight);
    const textContainerRef = useRef(null);
    const pageSize = { width: pageWidth, height: pageHeight };
    const { appStore, libraryStore } = useContext(RootStoreContext);
    const iref = useRef();

    const onDocumentLoadSuccess = (props: { numPages: number }) => {
        const { numPages } = props;
        onBookLoaded && onBookLoaded(numPages);
    };


    const fitPageSize = () => {
        const { width, height } = getClientSize();
        setPageWidth(width);
    };

    const [getOserver, setObserver] = useSingle<any>();

    const handleLoadSuccess = () => {
        scrollToPage(pageNumber);
    };

    const onTableOfContentItemClick = ({ pageIndex, pageNumber }) => {
        // setCurrentPageNumber(pageNumber);
        onPageChange(pageNumber);
        // iref.current.setPageNumber(pageNumber);
        scrollToPage(pageNumber);
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
                    <FastPages
                        ref={iref}
                        mode={mode}
                        pageCount={pageCount.current}
                        pageRatio={ratio.current}
                        pageSize={pageSize}
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
