import React, { useContext, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { IBook } from '../../types';
import BookItem from '../../components/common/BookItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { RootStoreContext } from '../../store/RootStore';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core';

const Spacer = styled.div`
    height: 56px;
    width: 100%;
    font-size: 0.8rem;
`;

const PreIS = styled.pre`
    white-space: break-spaces;
`;

type TSheveAction = {
    text: string;
    handler: TShelveActionHandler;
};

interface TShelve {
    books: IBook[];
    dialogBookClickHandler?: TShelveActionHandler;
    actions: TSheveAction[];
}

const Shelve = observer(
    ({ books, actions, dialogBookClickHandler }: TShelve) => {
        const { libraryStore } = useContext(RootStoreContext);
        const [isBookDialogOpenned, setIsBookDialogOpenned] = useState(false);
        const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
        const bookClickHandler = (book: IBook) => {
            setIsBookDialogOpenned(true);
            setSelectedBook(book);
        };
        const [moreExpanded, setMoreExpanded] = useState(false);
        const [shortExpanded, setShortExpanded] = useState(true);
        const handleDialogClose = () => {
            setIsBookDialogOpenned(false);
            setSelectedBook(null);
        };
        const handleBookAction = (action: TSheveAction) => {
            action.handler(selectedBook);
            handleDialogClose();
        };
        const handleDefaultAction = (book: IBook) =>
            dialogBookClickHandler && dialogBookClickHandler(book);

        const bookMeta = useMemo(
            () => JSON.stringify(selectedBook?.meta, null, 2),
            [selectedBook],
        );

        const bookTitle = useMemo(
            () => selectedBook?.meta?.title || selectedBook?.name || 'noname',
            [selectedBook],
        );

        const bookAuthor = useMemo(() => {
            const author = selectedBook?.meta?.author;
            return typeof author === 'object'
                ? //@ts-ignore
                  `${author.firstName} ${author.lastName}`
                : author;
        }, [selectedBook]);

        const bookPagesCount = useMemo(
            () => selectedBook?.pageCount,
            [selectedBook],
        );

        const bookKeywords = useMemo(
            () => selectedBook?.meta?.keywords,
            [selectedBook],
        );

        const bookSubject = useMemo(
            () => selectedBook?.meta?.subject,
            [selectedBook],
        );

        const bookCurrentPage = useMemo(
            () => libraryStore.getCurrentPage(selectedBook?.id) || 1,
            [selectedBook],
        );

        useEffect(() => {
            setMoreExpanded(false);
            setShortExpanded(true);
        }, [isBookDialogOpenned]);

        return (
            <>
                <Box display="flex" justifyContent="center" flexWrap="wrap">
                    {books.map((book: IBook, index: number) => (
                        <BookItem
                            key={index}
                            book={book}
                            onSingleClick={() => bookClickHandler(book)}
                            onDoubleClick={() => handleDefaultAction(book)}
                        />
                    ))}
                    <Spacer />
                </Box>
                <Dialog
                    onClose={handleDialogClose}
                    open={isBookDialogOpenned}
                    fullWidth={true}
                >
                    <DialogTitle></DialogTitle>
                    <DialogContent>
                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item>
                                {selectedBook && (
                                    <BookItem
                                        book={selectedBook}
                                        onSingleClick={() =>
                                            handleDefaultAction(selectedBook)
                                        }
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <BookDetails
                                    title={bookTitle}
                                    onChange={() =>
                                        setShortExpanded(!shortExpanded)
                                    }
                                    expanded={shortExpanded}
                                >
                                    <p>{bookAuthor}</p>
                                    <p>{bookSubject}</p>
                                    <p>
                                        current page: {bookCurrentPage}
                                        {bookPagesCount
                                            ? `/${bookPagesCount}`
                                            : ''}
                                    </p>
                                    <p>{bookKeywords}</p>
                                </BookDetails>
                                <BookDetails
                                    title="..."
                                    onChange={() =>
                                        setMoreExpanded(!moreExpanded)
                                    }
                                    expanded={moreExpanded}
                                >
                                    <PreIS>{bookMeta}</PreIS>
                                </BookDetails>
                                <Typography
                                    display="block"
                                    noWrap={true}
                                ></Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        {actions.map((action, index) => (
                            <Button
                                key={`shelve-actions_${index}`}
                                onClick={() => handleBookAction(action)}
                                color="primary"
                            >
                                {action.text}
                            </Button>
                        ))}
                    </DialogActions>
                </Dialog>
            </>
        );
    },
);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const BookDetails = ({ title, children, expanded, onChange }) => {
    return (
        <MuiAccordion square expanded={expanded} onChange={onChange}>
            <AccordionSummary>
                <Typography variant="h6">{title}</Typography>
            </AccordionSummary>
            <MuiAccordionDetails>
                <Typography>{children}</Typography>
            </MuiAccordionDetails>
        </MuiAccordion>
    );
};
export default Shelve;
