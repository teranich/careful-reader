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
        const ab = str2ab(this.rawText)
        console.log('ab', ab)
        return new Blob([ab], { type: 'application/pdf' });
    }
    getBookText() {
        const blob = this.getBlob()
        let url = window.URL.createObjectURL(blob);
        return url;
    }

    getBookCover() {
        const text = this.getBookText();
        const loadingTask = pdfjs.getDocument(text);

        return loadingTask.promise
            .then(function (pdfDocument) {
                // Request a first page
                return pdfDocument.getPage(1).then(function (pdfPage) {
                    console.log(pdfPage)
                    // Display page on the existing canvas with 100% scale.
                    const viewport = pdfPage.getViewport({ scale: 1.0 });
                    const canvas = document.createElement('canvas')
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const ctx = canvas.getContext('2d');
                    const renderTask = pdfPage.render({
                        canvasContext: ctx,
                        viewport,
                    });
                    // return canvas.toDataURL();
                    return renderTask
                });
            })
            .catch(function (reason) {
                console.error('Error: ' + reason);
            });
    }

    parse() {}
}
