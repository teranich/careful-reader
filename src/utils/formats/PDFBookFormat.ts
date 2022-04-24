import { BookFormats, IBook, TBookMeta } from '../../types';
import { str2ab } from '../common';
import { BookFormat } from './BookFormats.types';
import { pdfjs } from 'react-pdf';
import libraryDB from '../clientDB';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
export class PDFBookFormat implements BookFormat {
    private rawText: string;
    private name: string;
    static isPDF(type: string) {
        return type === 'application/pdf';
    }

    constructor(rawText: string, name: string) {
        this.rawText = rawText;
        this.name = name;
    }

    async getRawMeta(): Promise<any> {
        const text = this.getBookText();
        const loadingTask = pdfjs.getDocument(text);

        return new Promise<string>((resolve) => {
            loadingTask.promise
                .then(function (pdfDocument) {
                    return pdfDocument.getMetadata().then((res) => {
                        console.log('info', pdfDocument, res);
                        resolve({
                            ...res.info,
                            numPages: pdfDocument?.numPages,
                        });
                    });
                })
                .catch(function (reason) {
                    console.error('Error: ' + reason);
                });
        });
    }

    getRaw() {
        return this.rawText;
    }

    getBlob() {
        const ab = str2ab(this.rawText);
        return new Blob([ab], { type: 'application/pdf' });
    }
    getBookText() {
        const blob = this.getBlob();
        let url = window.URL.createObjectURL(blob);
        return url;
    }

    getBookCover(width = 115, height = 185) {
        const text = this.getBookText();
        const loadingTask = pdfjs.getDocument(text);

        return new Promise<string>((resolve) => {
            loadingTask.promise
                .then(function (pdfDocument) {
                    pdfDocument.getPage(1).then(function (pdfPage) {
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        const unscaledViewport = pdfPage.getViewport({
                            scale: 1,
                        });
                        const scale = Math.min(
                            canvas.height / unscaledViewport.height,
                            canvas.width / unscaledViewport.width,
                        );

                        const viewport = pdfPage.getViewport({ scale });
                        const renderTask = pdfPage.render({
                            canvasContext: ctx,
                            viewport,
                        });
                        renderTask.promise.then(() => {
                            const canvasBase64 = canvas?.toDataURL();
                            resolve(canvasBase64);
                        });
                    });
                })
                .catch(function (reason) {
                    console.error('Error: ' + reason);
                });
        });
    }

    parse() {}

    async saveBook(): Promise<IBook> {
        const cover = await this.getBookCover();
        const rawBookMeta = await this.getRawMeta();
        const [name] = this.name.split('.pdf') || this.name;
        console.log('saveBook', this.mapRawMeta(rawBookMeta));

        const newBook = {
            name,
            meta: this.mapRawMeta(rawBookMeta),
            pageCount: rawBookMeta.numPages,
            format: BookFormats.PDF,
            cover,
        };

        return await libraryDB.addBook(newBook, this.getRaw());
    }

    private mapRawMeta(raw: any): TBookMeta {
        console.log('raw', raw)
        const {
            Title: title,
            Author: author,
            Language: language,
            Subject: subject,
            Keywords: keywords,
            ...rest
        } = raw;
        return { title, author, language, subject, keywords, rest };
    }
}
