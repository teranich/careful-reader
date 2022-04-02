import { IBook } from '../../types';

export interface BookFormat {
    constructor: (rawText: string) => void;
    getBookMeta: () => IBook;
    getBookText: () => string;
    getBookCover: () => string;
    saveBook: () => Promise<IBook> ;
}