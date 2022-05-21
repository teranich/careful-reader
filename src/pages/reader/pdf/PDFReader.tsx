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
    oldPageNumber: number;
    mode: string;
    onBookLoaded: (numPages: number) => {};
    onPageChange: (page: number) => {};
};

function PDFReader(
    { book, oldPageNumber, onPageChange, onBookLoaded, mode }: TPDFReaderProps,
    ref,
) {
    const pageCount = useRef(book.card.pageCount);
    const ratio = useRef(book.card.ratio || 1.5);
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
            console.log('itercepter', pageNumberInView, currentPage);
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

    const onDocumentLoadSuccess = (props: { numPages: number }) => {
        const { numPages } = props;
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

    const handleLoadSucess = () => {
        console.log('restore last read position', getCurrentPageNumber());
        scrollToPage(getCurrentPageNumber());
    };

    const onTableOfContentItemClick = ({ pageIndex, pageNumber }) => {
        setCurrentPageNumber(pageNumber);
        onPageChange(getCurrentPageNumber());
        iref.current.setPageNumber(pageNumber);
        scrollToPage(getCurrentPageNumber());
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
                        pageNumber={getCurrentPageNumber()}
                        onPageChange={onPageChange}
                        onLoadSuccess={handleLoadSucess}
                    />
                </DocumentIS>
            )}
        </>
    );
}

export default observer(forwardRef(PDFReader));
