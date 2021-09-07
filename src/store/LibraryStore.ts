import { RootStore } from './RootStore';
import { action, makeAutoObservable, toJS } from 'mobx';
import libraryDB from '../utils/clientDB';
import { BookList, Book } from '../types';
import * as converter from '../utils/converter';

export type TCurrentBook =
    | {
          info: Book;
          text: string;
      }
    | undefined;
export class LibraryStore {
    public isAddingBookInProcess = false;
    public isFetchingBooksInProcess = false;
    public books: BookList = [];
    public lastBook: TCurrentBook;

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

    isBookExist = (name: string | undefined) => this.books.find((book: Book) => book.name === name);

    addBookAction = action(async (rawBookText: string, name: string, type: string) => {
        console.log(name, type);

        if (type === 'application/pdf') {
            console.log('application/pdf');
            const newBook = {
                name: 'gita',
                format: 'pdf',
                meta: {},
                cover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAeCAYAAAAsEj5rAAAAUklEQVR42u3VMQoAIBADQf8Pgj+OD9hG2CtONJB2ymQkKe0HbwAP0xucDiQWARITIDEBEnMgMQ8S8+AqBIl6kKgHiXqQqAeJepBo/z38J/U0uAHlaBkBl9I4GwAAAABJRU5ErkJggg==',
            };
            const book = await libraryDB.addBook(newBook, rawBookText);
            this.books.push(book);
        } else if (type === 'text/xml') {
            const { cover, meta } = converter.getBookPreviewInfo(rawBookText);
            const newBook = {
                name,
                meta,
                format: 'fb2',
                cover,
            };

            this.isAddingBookInProcess = true;
            const book = await libraryDB.addBook(newBook, rawBookText);
            this.books.push(book);
            this.isAddingBookInProcess = false;
            this.rootStore.notification.info('book has been added');
        }
    });

    syncBookAction = action(async (meta: Book, body: string) => {
        const { id, ...rest } = meta;
        const metaWithoutObserving = toJS(rest);
        metaWithoutObserving.meta = toJS(metaWithoutObserving.meta);
        const book = await libraryDB.addBook(metaWithoutObserving, body);
        this.books.push(book);
    });

    removeBookAction = action(async (book: Book | null) => {
        if (!book) return;
        await libraryDB.delete(book.id);
        const bookIndex = this.books.indexOf(book);
        this.books.splice(bookIndex, 1);
        this.rootStore.notification.info('book has been removed');
    });

    updateBookPositionAction = action(async (book: Book, positionElement: string) => {
        const bookId = book.id;
        await libraryDB.updateBookMeta(bookId, { positionElement });
        book.positionElement = positionElement;
        // await this.rootStore.syncMetaAction(book)
    });

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
    openBookAction = action(async (bookId: number): Promise<TCurrentBook> => {
        if (this.lastBook && this.lastBook.info.id === bookId) {
            this.lastBook.info = (await libraryDB.getBookMeta(bookId)) || this.lastBook.info;
            return Promise.resolve(this.lastBook);
        } else {
            return Promise.all([libraryDB.getBookMeta(bookId), libraryDB.getBookText(bookId)]).then((prom) => {
                const info = prom[0] as Book;
                const rawText = prom[1] || '';

                const text = info.format === 'fb2' ? converter.parseToInnerBook(rawText) : rawText;

                this.lastBook = {
                    info,
                    text,
                };
                return this.lastBook;
            });
        }
    });

    fetchBookTextAction = action(async (bookId: number) => await libraryDB.getBookText(bookId));
}
