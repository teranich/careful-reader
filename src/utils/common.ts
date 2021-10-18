import { BookList } from '../types';
import { defaultEncoding, getTextEncoding, isDefaultEncoding } from './converter';

export async function getBooksList(): Promise<BookList> {
    return fetch('db.json').then((resp) => resp.json());
}

export async function getBook(filePath: string): Promise<string> {
    return fetch(filePath).then((resp) => resp.text());
}

export async function readFile(file: File, encoding: string = defaultEncoding): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = (event) => {
            const result = event?.target?.result;
            if (result && typeof result === 'string') {
                return resolve(result);
            }
            return reject('');
        };
        reader.onerror = (error) => reject('error reading file' + error);
        if (file.type === 'application/pdf') {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsText(file, encoding);
        }
    });
}
export async function readFileContent(file: File): Promise<string> {
    const text = await readFile(file);
    const encoding = getTextEncoding(text);

    if (isDefaultEncoding(encoding)) return text;
    return await readFile(file, encoding);
}

export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = (...args: Parameters<F>) => {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(() => func(...args), waitFor);
    };

    return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

export function importScript(src: string) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        document.body.appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
        script.async = true;
        script.src = src;
        return src;
    });
}

export function str2ab(str: string) {
    var idx,
        len = str.length,
        arr = new Array(len);
    for (idx = 0; idx < len; ++idx) {
        arr[idx] = str.charCodeAt(idx) & 0xff;
    }

    return new Uint8Array(arr).buffer;
}

export const pdfTextToObjectUrl = (text: string) => {
    const ab = str2ab(text);
    console.log('ab', ab)
    let blob = new Blob([ab], { type: 'application/pdf' });
    let url = window.URL.createObjectURL(blob);
    return url;
};

export const getClientSize = () => ({
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
});
