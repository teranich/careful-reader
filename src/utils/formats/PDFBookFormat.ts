import { Book } from '../../types';
import { str2ab } from '../common';
import { BookFormat } from './BookFormats.types';
import { getDocument } from 'pdfjs-dist';

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
        console.log('text', this.rawText);
        const loadingTask = getDocument(text);
        loadingTask.promise
            .then(function (pdfDocument) {
                // Request a first page
                return pdfDocument.getPage(1).then(function (pdfPage) {
                    // Display page on the existing canvas with 100% scale.
                    const viewport = pdfPage.getViewport({ scale: 1.0 });
                    const canvas = document.getElementById('theCanvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const ctx = canvas.getContext('2d');
                    const renderTask = pdfPage.render({
                        canvasContext: ctx,
                        viewport,
                    });
                    return renderTask.promise;
                });
            })
            .catch(function (reason) {
                console.error('Error: ' + reason);
            });
    }

    parse() {}
}
