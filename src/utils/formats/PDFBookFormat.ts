import { Book } from '../../types';
import { str2ab } from '../common';
import { BookFormat } from './BookFormats.types';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
export class PDFBookFormat implements BookFormat {
    private rawText: string;

    constructor(rawText: string) {
        this.rawText = rawText;
    }

    getBookMeta(): Book {}

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

        return new Promise((resolve) => {
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
}
