import { RootStore } from './RootStore'
import { action, makeObservable, observable } from 'mobx'
import { Book } from '../types'
import * as cloud from '../uitls/cloud'
import libraryDB from '../uitls/clientDB'

export default class RemoteLibraryStore {
  books: Book[] = []
  isClientLoaded = false
  isLoggedIn = false
  isBooksLoading = false
  isUploading = false

  private remoteFolderName = 'careful-reader'
  private cloudAppFolder = cloud.appFolder
  private cloudDrive = cloud.drive
  private rootStore: RootStore

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      books: observable,
      isClientLoaded: observable,
      isLoggedIn: observable,
      isBooksLoading: observable,
      isUploading: observable,
    })
    this.rootStore = rootStore
    cloud.load().then(() => {
      this.isClientLoaded = true
      cloud.isLoggedIn().then((isLoggedIn) => (this.isLoggedIn = isLoggedIn))
    })
  }
  nitLibrary = action(async () => {
    cloud.drive.create.folder('books-folder')
  })

  fetchBooksListAction = action(async () => {
    this.isBooksLoading = true
    const cloudFiles = await this.cloudAppFolder.find.file(
      `name contains '-meta.json'`
    )
    const contentPromises = cloudFiles.map((fileMeta: { id: string }) =>
      this.cloudAppFolder.download(fileMeta.id).then((content) => {
        //@ts-ignore
        const book: Book = content
        this.books.push(book)
      })
    )
    this.books = []
    await Promise.all(contentPromises)
    this.isBooksLoading = false
  })

  uploadBookAction = action(async (book: Book | null) => {
    if (!book) return
    this.isUploading = true
    const [currentFolder] = await this.cloudDrive.getOrCreate.folder(
      `name = '${this.remoteFolderName}'`,
      this.remoteFolderName
    )
    const [currentFile] = await this.cloudDrive.getOrCreate.file(
      `name = '${book.name}' and '${currentFolder.id}' in parents`,
      book.name,
      currentFolder.id
    )
    const bookText = await libraryDB.getBookText(book.id)
    const { id: textFileId } = await this.cloudDrive.upload(
      currentFile.id,
      bookText
    )
    const updatedBookMeta = await libraryDB.updateBookMeta(book.id, {
      textFileId,
    })
    const result = await this.syncMetaAction(updatedBookMeta)
    this.books.push(book)
    this.isUploading = false
    return result
  })

  syncMetaAction = action(async (book: Book | null) => {
    if (!book) return
    this.isUploading = true
    const metaFileName = book.name + '-meta.json'
    const [currentFile] = await this.cloudAppFolder.getOrCreate.file(
      `name = '${metaFileName}'`,
      metaFileName
    )
    const { id: metaFileId } = await this.cloudAppFolder.upload(
      currentFile.id,
      JSON.stringify(book)
    )
    const result = await libraryDB.updateBookMeta(book.id, { metaFileId })
    this.isUploading = false
    return result
  })

  downloadBookAction = action(async (book: Book | null) => {
    if (!book) return
    if (book.textFileId) {
      return await this.cloudDrive.download(book.textFileId)
    }
    return ''
  })

  forceBookRemove = async (book: Book) => {
    const cloudMetaFile = await this.cloudAppFolder.find
      .file(`name = '${book.name}-meta.json'`)
      .then(([file]) => file?.id && this.cloudAppFolder.remove(file.id))

    const cloudFile = await this.cloudDrive.find
      .file(`name = '${book.name}'`)
      .then(({ file }) => file?.id && this.cloudDrive.remove(file.id))

    return Promise.allSettled([cloudFile, cloudMetaFile])
  }

  removeBookAction = action(async (book: Book | null) => {
    if (!book) return
    const index = this.books.indexOf(book)
    if (index > -1) {
      this.books.splice(index, 1)
    }
    if (!book.metaFileId || !book.textFileId) {
      await this.forceBookRemove(book)
    } else {
      const promises = []

      book.textFileId && promises.push(this.cloudDrive.remove(book.textFileId))
      book.metaFileId &&
        promises.push(this.cloudAppFolder.remove(book.metaFileId))
      await Promise.allSettled(promises)
    }
  })
}
