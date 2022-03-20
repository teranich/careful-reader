import { Book } from '../../types';

export interface BookFormat {
    constructor: (rawText: string) => void;
    getBookMeta: () => Book;
    getBookText: () => string;
    getBookCover: () => string;
    saveBook: () => Promise<Book> ;
}