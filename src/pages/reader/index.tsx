import { useContext, useEffect, useRef, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import FB2Reader from './FB2Reader';
import PDFReader from './PDFReader';
import { RootStoreContext } from '../../store/RootStore';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/common';
import styled from 'styled-components';
import { TCurrentBook } from 'src/store/LibraryStore';
import { HightlightSwitcher } from '../../components/controls';
import useDoubleClick from '../../hooks/UseDoubleClick';
interface QueryParams {
    bookId: string;
}

const PageCount = styled.span`
    white-space: nowrap;
    padding: 6px 8px;
`;

export default observer(function Reader() {
    const queryParams = useParams<QueryParams>();
    const bookId = parseInt(queryParams.bookId);
    const oldPageNumber = useRef(
        parseInt(localStorage.getItem(String(bookId))) || 1,
    );
    const [currentReader, setCurrentReader] = useState<undefined | string>();
    const { libraryStore } = useContext(RootStoreContext);
    const { getBookMeta } = libraryStore;
    const [numberOfcurrentPage, setNumberOfCurrentPage] = useState(
        oldPageNumber.current,
    );
    const [showControls, setShowControls] = useState(true);
    const [currenPositionPercent, setCurrenPositionPercent] = useState('0.0');
    const [pagesCount, setPagesCount] = useState(0);
    const bookTitle = () =>
        currentBookRef.current?.info?.meta?.title ||
        currentBookRef.current?.info?.name;
    const { openBookAction, lastBook, updateLocalBookPositionAction } =
        libraryStore;
    const currentBookRef = useRef<TCurrentBook>(lastBook);
    const [book, setBook] = useState<TCurrentBook>();
    const textContainerRef = useRef();
    useEffect(() => {
        const openBook = async () => {
            const meta = await getBookMeta(bookId);
            const openedBook = await openBookAction(bookId);
            setBook(openedBook);
            meta && setCurrentReader(meta?.format);
        };
        openBook();
    }, []);

    const onBookLoaded = useCallback((count) => setPagesCount(count), []);
    const onPageChange = useCallback((page) => {
        setNumberOfCurrentPage(page);
        localStorage.setItem(String(bookId), page);
    }, []);

    useDoubleClick({
        onSingleClick: () => {},
        onDoubleClick: () => {
            setShowControls(!showControls);
        },
        ref: textContainerRef,
        latency: 200,
    });

    return (
        <>
            <Header visible={showControls} title={bookTitle()}>
                <HightlightSwitcher />
                <div>{currenPositionPercent}%</div>
                <PageCount>{`${numberOfcurrentPage}/${pagesCount}`}</PageCount>
            </Header>
            <div ref={textContainerRef}>
                {currentReader === 'fb2' && <FB2Reader></FB2Reader>}
                {currentReader === 'pdf' && book && (
                    <PDFReader
                        book={book}
                        mode="greed"
                        oldPageNumber={oldPageNumber.current}
                        onBookLoaded={onBookLoaded}
                        onPageChange={onPageChange}
                    ></PDFReader>
                )}
            </div>
        </>
    );
});
