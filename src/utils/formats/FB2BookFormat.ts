import { BookFormat } from './BookFormats.types';
import * as converter from '../../utils/converter';
import libraryDB from '../clientDB';
import { Book } from '../../types';
export class FB2BookFormat implements BookFormat {
    rawText: string
    static isFB2(name: string = '') { 
        return name.split('.').pop() === 'fb2'
    }
    constructor(rawText: string) {
        this.rawText = rawText;
    }
    getBookCover() {
        const { cover, meta } = converter.getBookPreviewInfo(
            this.rawText 
        );
    }

    async saveBook(): Promise<Book> {
        const { cover, meta } = converter.getBookPreviewInfo(
            this.rawText
        );
        const newBook = {
            name,
            meta,
            format: 'fb2',
            cover,
        };
       
        return await libraryDB.addBook(newBook, this.rawText);
    }
}