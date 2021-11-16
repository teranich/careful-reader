import text from '../../mocks/book.pdf';
import { PDFBookFormat } from './PDFBookFormat';

describe('PDF format', () => {
    window.URL.createObjectURL = jest.fn();
    const pdfFormat = new PDFBookFormat(text);
    const cover = pdfFormat.getBlob();
    it('statrt', () => {
        expect(true).toBe(true);
    });
});
