export enum BookFormats {
    FB2 = 'fb2',
    PDF = 'pdf',
}
export type TBookId = string;
export type TBookMeta = {
    title?: string,    
    author?: string,
    language?: string,
    subject?: string,
    keywords?: string,
    rest?: Object    
}

export type TBookPosition = string;
export type TBookText = string;
export type TBooksIndex = {}
export interface IBook {
    id: number;
    name: string;
    pageCount: number;
    cover: string;
    format: BookFormats;
    position: number;
    meta?: TBookMeta;
    metaFileId?: string;
    textFileId?: string;
    positionElement?: any;
    timestamp?: number;
}

export type BookList = IBook[];
