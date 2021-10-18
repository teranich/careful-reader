import text from '../../mocks/book.pdf';
import { PDFBookFormat } from './PDFBookFormat';
describe('PDF format', () => {
    window.URL.createObjectURL = jest.fn();
    // console.log(text);
    const pdfFormat = new PDFBookFormat(text);
    const cover = pdfFormat.getBlob();
    console.log('cover', cover);
    it('statrt', () => {
        expect(true).toBe(true);
    });
});
