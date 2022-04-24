import {
    IBook,
    TBookId,
    TBookMeta,
    TBookPosition,
    TBooksIndex,
    TBookText,
} from '../../types';
import { ICloudProvider } from './ICloudProvader.interface';
import * as cloud from './GoogleCloud.utils';
import { TGoogleDriveFile } from './GoogleCloud.utils';

export class GoogleProvider implements ICloudProvider {
    private rootFolderName = 'careful-reader';
    private rootFolder: TGoogleDriveFile | undefined;
    private indexFileName = 'books-index';    
    private textFileName = 'text';    
    private indexFile: TGoogleDriveFile | undefined;
    async init() {
        await cloud.load();
        if (cloud.isLoggedIn()) {
            const content = await this.loadMetaInfo();
            console.log('this.indexFile = ',content);
        }
    }

    async signIn() {
        await cloud.signIn();
        const content = await this.loadMetaInfo();
        console.log('this.indexFile = ',content);
        // const { id } = await this.upgetRootFolder();
    }

    signOut() {
        return cloud.signOut();
    }
    isLoggedIn() {
        return cloud.isLoggedIn();
    }
    async fetchIndex(id: string): Promise<TBooksIndex> {
        const result = await cloud.drive.download(id);
        return result;
    }

    async uploadBook(book: IBook, text: TBookText): Promise<void> {
        console.log('create book', book, text.length);
        const {root, content, index} = await this.loadMetaInfo(); 
        const bookFolder = await this.upgetFolder(book.name, root.id)

        const bookFile = await this.upgetFile(`${book.name}.${book.format}`, bookFolder.id); 
        await cloud.drive.upload(bookFile.id, text,  book.format)

    }

    // fetchText(bookId: TBookId): Promise<TBookText> {}
    // fetchMeta(bookId: TBookId): Promise<TBookMeta>
    // fetchPosition(bookId: TBookId): Promise<TBookPosition>
    // updateIndex(index: TBooksIndex): void;
    // updateMeta(bookId: TBookId, meta: TBookMeta): void
    // updateText(bookId: TBookId, text: TBookText): void
    // updatePosition(bookId: TBookId, position: TBookPosition): void

    private async uploadContent(fileId: string, content: string) {
        return  await cloud.drive.upload(fileId, content)
    }
    private async loadMetaInfo() {
        const root = await this.upgetFolder(this.rootFolderName);
        const index = await this.upgetFile(this.indexFileName, root.id);
        const content = await this.fetchIndex(index.id);
        return {index, content, root};
    }

    private async upgetFolder(folderName: string, rootFolderId?: string) {
        const [folder] = await cloud.drive.getOrCreate.folder(
            `name = '${folderName}'`,
            folderName,
            rootFolderId
        );

        return folder;
    }
    private async upgetFile(fileName: string, folderId: string) {
        const [file] = await cloud.drive.getOrCreate.file(
            `name = '${fileName}' and '${folderId}' in parents`,
            fileName,
            folderId,
        );

        return file;
    }
}
