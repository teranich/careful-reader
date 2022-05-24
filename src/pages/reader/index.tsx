import { useContext, useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { observer } from 'mobx-react';
import FB2Reader from './fb2/FB2Reader';
import PDFReader from './pdf/PDFReader';
import { RootStoreContext } from '../../store/RootStore';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/common';
import styled from 'styled-components';
import { TCurrentBook } from 'src/store/LibraryStore';
import { HightlightSwitcher } from '../../components/controls';
import useDoubleClick from '../../hooks/UseDoubleClick';
import { FormControlLabel, FormGroup } from '@material-ui/core';
import { Hightlighter } from './Hightlighter';

interface QueryParams {
    bookId: string;
}

const PageCountIS = styled.span`
    cursor: pointer;
    white-space: nowrap;
    padding: 6px 8px;
`;

const TableOfContentIS = styled.div`
    cursor: pointer;
    padding: 10px;
    text-transform: uppercase;
`;

export default observer(function Reader() {
    const queryParams = useParams<QueryParams>();
    const bookId = parseInt(queryParams.bookId);
    const initPageNumber = useRef(parseInt(localStorage.getItem(String(bookId))) || 1, [])
    console.log('initPageNumber', initPageNumber)
    const [pageNumber, setPageNumber] = useState(
        initPageNumber.current

    );
    const [currentReader, setCurrentReader] = useState<undefined | string>();
    const { appStore, libraryStore } = useContext(RootStoreContext);
    const { getBookMeta } = libraryStore;
    const [showControls, setShowControls] = useState(true);
    const [pagesCount, setPagesCount] = useState(0);
    const bookTitle = () =>
        currentBookRef.current?.info?.meta?.title ||
        currentBookRef.current?.info?.name;
    const { openBookAction, lastBook, updateLocalBookPositionAction } =
        libraryStore;
    const currentBookRef = useRef<TCurrentBook>(lastBook);
    const pdfRef = useRef();
    const [book, setBook] = useState<TCurrentBook>();
    const { wordsHighlight } = appStore;
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

    const handleBookLoaded = useCallback((count) => setPagesCount(count), []);
    const handlePageChange = useCallback((page) => {
        console.log('new page', page);
        // setNumberOfCurrentPage(page);
        setPageNumber(page);
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
    const gotToPageHandler = () => {
        console.log('gotToPageHandler');
    };

    return (
        <>
            <Header visible={showControls} title={bookTitle()}>
                <FormControlLabel
                    label="HL"
                    control={<HightlightSwitcher />}
                />
                <TableOfContentIS
                    onClick={() => {
                        pdfRef.current.toggleTableOfContents();
                    }}
                    title="Table of Content"
                >
                    ToC
                </TableOfContentIS>
                <PageCountIS
                    onClick={gotToPageHandler}
                >{`${pageNumber}/${pagesCount}`}</PageCountIS>
            </Header>
            <div ref={textContainerRef}>
                <Hightlighter wordsHighlight={wordsHighlight}>
                    {currentReader === 'fb2' && <FB2Reader></FB2Reader>}
                    {currentReader === 'pdf' && book && (
                        <PDFReader
                            ref={pdfRef}
                            book={book}
                            mode="greed"
                            pageNumber={initPageNumber.current}
                            onBookLoaded={handleBookLoaded}
                            onPageChange={handlePageChange}
                        ></PDFReader>
                    )}
                </Hightlighter>
            </div>
        </>
    );
});
