import {
    TBookId,
    TBookMeta,
    TBookPosition,
    TBookText,
    TBooksIndex,
} from '../../types';

export interface ICloudProvider {
    init(): void;
    signIn(): void;
    signOut(): void;
    isLoggedIn(): boolean;
    fetchIndex(): Promise<TBooksIndex>;
    fetchText(bookId: TBookId): Promise<TBookText>;
    fetchMeta(bookId: TBookId): Promise<TBookMeta>;
    fetchPosition(bookId: TBookId): Promise<TBookPosition>;
    updateIndex(index: TBooksIndex): void;
    updateMeta(bookId: TBookId, meta: TBookMeta): void;
    updateText(bookId: TBookId, text: TBookText): void;
    updatePosition(bookId: TBookId, position: TBookPosition): void;
    uploadBook(book: IBook, text: TBookText): Promise<void>
}
