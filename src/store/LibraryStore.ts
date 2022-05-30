import { RootStore } from './RootStore';
import { action, makeAutoObservable, toJS } from 'mobx';
import libraryDB from '../utils/clientDB';
import { BookFormats, BookList, IBook } from '../types';
import * as converter from '../utils/converter';
import { getBookFormat } from '../utils/BookFormats';

export type TCurrentBook = {
    card: IBook;
    text: string;
};
export class LibraryStore {
    public isAddingBookInProcess = false;
    public isFetchingBooksInProcess = false;
    public books: BookList = [];
    public lastBook: TCurrentBook | undefined;

    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }
    fetchBooksListAction = action(async () => {
        this.isFetchingBooksInProcess = true;
        this.books = await libraryDB.getAllMeta();
        this.isFetchingBooksInProcess = false;
    });

    isBookExist = (name: string | undefined) =>
        this.books.find((book: IBook) => book.name === name);

    addBookAction = action(
        async (rawBookText: string, name: string, type: string) => {
            const format = getBookFormat(rawBookText, name, type);

            if (format) {
                const book = await format.saveBook();

                this.books.push(book);
                this.isAddingBookInProcess = false;
                this.rootStore.notification.info('book has been added');
            }
        },
    );

    syncBookAction = action(async (meta: IBook, body: string) => {
        const { id, ...rest } = meta;
        const metaWithoutObserving = toJS(rest);
        metaWithoutObserving.meta = toJS(metaWithoutObserving.meta);
        const book = await libraryDB.addBook(metaWithoutObserving, body);
        this.books.push(book);
    });

    removeBookAction = action(async (book: IBook | null) => {
        if (!book) return;
        await libraryDB.delete(book.id);
        const bookIndex = this.books.indexOf(book);
        this.books.splice(bookIndex, 1);
        this.rootStore.notification.info('book has been removed');
    });

    updateBookPositionAction = action(
        async (book: IBook, positionElement: string) => {
            const bookId = book.id;
            await libraryDB.updateBookMeta(bookId, { positionElement });
            book.positionElement = positionElement;
        },
    );

    updateLocalBookPositionAction = action(
        async (book: IBook, pageNumber: number) => {
            localStorage.setItem(String(book.id), String(pageNumber));
        },
    );

    updateBookAction = action(async (bookId: number, bookProps: any) => {
        const bookInStore = this.books.find((book) => book.id === bookId);
        if (bookInStore) {
            Object.assign(bookInStore, bookProps);
        }
        await libraryDB.updateBookMeta(bookId, bookProps);
    });

    getBookMeta = action(async (bookId: number) => {
        return await libraryDB.getBookMeta(bookId);
    });

    getCurrentPage = action((bookId: number | undefined) => {
        return parseInt(localStorage.getItem(String(bookId))) || 1;
    });

    openBookAction = action(async (bookId: number): Promise<TCurrentBook> => {
        if (this.lastBook && this.lastBook.card.id === bookId) {
            this.lastBook.card =
                (await libraryDB.getBookMeta(bookId)) || this.lastBook.card;
            return Promise.resolve(this.lastBook);
        } else {
            return Promise.all([
                libraryDB.getBookMeta(bookId),
                libraryDB.getBookText(bookId),
            ]).then((prom) => {
                const card = prom[0] as IBook;
                const rawText = prom[1] || '';

                const text =
                    card.format === BookFormats.FB2
                        ? converter.parseToInnerBook(rawText)
                        : rawText;

                this.lastBook = {
                    card,
                    text,
                };
                return this.lastBook;
            });
        }
    });

    fetchBookTextAction = action(
        async (bookId: number) => await libraryDB.getBookText(bookId),
    );
}
