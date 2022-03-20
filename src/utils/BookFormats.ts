import { BookFormat } from './formats/BookFormats.types';
import { FB2BookFormat } from './formats/FB2BookFormat';
import { PDFBookFormat } from './formats/PDFBookFormat';

export const getBookFormat = (
    rawBookText: string,
    name: string,
    type: string,
): BookFormat => {
    let format: BookFormat | null = null;
    if (PDFBookFormat.isPDF(type)) {
        format = new PDFBookFormat(rawBookText);
    } else if (FB2BookFormat.isFB2(name)) {
        format = new FB2BookFormat(rawBookText);
    }
    return format;
};
