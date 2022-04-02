enum formats {
    fb2 = 'fb2',
    pdf = 'pdf',
}
export interface IBook {
    id: number;
    meta?: any;
    metaFileId?: string;
    textFileId?: string;
    name: string;
    format: formats;
    positionElement?: any;
    cover: string;
    timestamp?: number;
}

export type BookList = IBook[];
