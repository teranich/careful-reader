import { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import FB2Reader from './FB2Reader';
import PDFReader from './PDFReader';
import { RootStoreContext } from '../../store/RootStore';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/common';
import styled from 'styled-components';
import { TCurrentBook } from 'src/store/LibraryStore';

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
    const oldPageNumber =
        parseInt(localStorage.getItem(String(bookId))) || 1;
    const [currentReader, setCurrentReader] = useState<undefined | string>();
    const { libraryStore } = useContext(RootStoreContext);
    const { getBookMeta } = libraryStore;
    const [numberOfcurrentPage, setNumberOfCurrentPage] = useState(oldPageNumber);
    const [showControls, setShowControls] = useState(true);
    const [currenPositionPercent, setCurrenPositionPercent] = useState('0.0');
    const [pagesCount, setPagesCount] = useState(0);
    const bookTitle = () =>
        currentBookRef.current?.info?.meta?.title ||
        currentBookRef.current?.info?.name;
    const { updateBookPositionAction, openBookAction, lastBook, updateLocalBookPositionAction } =
        libraryStore;
    const currentBookRef = useRef<TCurrentBook>(lastBook);
    const [book, setBook] = useState<TCurrentBook>();

    useEffect(() => {
        const openBook = async () => {
            const meta = await getBookMeta(bookId);
            const openedBook = await openBookAction(bookId);
            setBook(openedBook);
            meta && setCurrentReader(meta?.format);
        };
        openBook();
    }, []);

    const onBookLoaded = (count) => setPagesCount(count);
    const onPageChange = (page) => {
        setNumberOfCurrentPage(page)
        book?.info && updateLocalBookPositionAction(book?.info, page)
    };

    return (
        <>
            <Header
                className={`${showControls ? '' : ' hidden'} `}
                title={bookTitle()}
            >
                <div>{currenPositionPercent}%</div>
                <PageCount>{`${numberOfcurrentPage}/${pagesCount}`}</PageCount>
            </Header>
            {currentReader === 'fb2' && <FB2Reader></FB2Reader>}
            {currentReader === 'pdf' && (
                <PDFReader
                    book={book}
                    mode="greed"
                    oldPageNumber={oldPageNumber}
                    onBookLoaded={onBookLoaded}
                    onPageChange={onPageChange}
                ></PDFReader>
            )}
        </>
    );
});
// export  { FB2Reader as Reader, PDFReader }
