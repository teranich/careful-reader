import { RootStore } from './RootStore'
import { action, makeAutoObservable } from 'mobx'
import { Book } from '../types'
import * as cloud from '../uitls/cloud'
import libraryDB from '../uitls/clientDB'

export default class RemoteLibraryStore {
  books: Book[] = []
  isClientLoaded = false
  isLoggedIn = false
  isBooksLoading = false
  isUploading = false
  isDownloading = false
  isBookRemoving = false

  private remoteFolderName = 'careful-reader'
  private cloudAppFolder = cloud.appFolder
  private cloudDrive = cloud.drive
  private rootStore: RootStore

  constructor(rootStore: RootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    cloud.load().then(() => {
      this.isClientLoaded = true
      cloud.isLoggedIn().then((isLoggedIn) => (this.isLoggedIn = isLoggedIn))
    })
  }
  initLibrary = action(async () => {
    cloud.drive.create.folder('books-folder')
  })

  fetchBooksListAction = action(async () => {
    try {
      this.isBooksLoading = true
      const cloudFiles = await this.cloudAppFolder.find.file(
        `name contains '-meta.json'`
      )
      const contentPromises = cloudFiles.map((fileMeta: { id: string }) =>
        this.cloudAppFolder.download(fileMeta.id).then((content) => {
          //@ts-ignore
          const book: Book = JSON.parse(content)
          this.books.push(book)
        })
      )
      this.books = []
      await Promise.all(contentPromises)
    } catch (e) {
      this.rootStore.notification.error('Fetching remote books error')
    } finally {
      this.isBooksLoading = false
    }
  })

  uploadBookAction = action(async (book: Book | null) => {
    if (!book) return
    try {
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
      this.rootStore.notification.info('Upload success')
      return result
    } catch (e) {
      this.rootStore.notification.error('Upload error')
    } finally {
      this.isUploading = false
    }
  })

  syncMetaAction = action(async (book: Book | null) => {
    if (!book) return
    try {
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
      return await libraryDB.updateBookMeta(book.id, { metaFileId })
    } catch (e) {
      this.rootStore.notification.error('sync error')
    } finally {
      this.isUploading = false
    }
  })

  downloadBookAction = action(async (book: Book | null) => {
    if (!book) return
    let result = ''
    try {
      this.isDownloading = true
      if (book.textFileId) {
        this.rootStore.notification.info('download sucess')
        result = await this.cloudDrive.download(book.textFileId)
      }
      return result
    } catch (e) {
      this.rootStore.notification.error('download error')
      return result
    } finally {
      this.isDownloading = false
    }
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
    try {
      this.isBookRemoving = true
      const index = this.books.indexOf(book)
      if (index > -1) {
        this.books.splice(index, 1)
      }
      if (!book.metaFileId || !book.textFileId) {
        await this.forceBookRemove(book)
      } else {
        const promises = []

        book.textFileId &&
          promises.push(this.cloudDrive.remove(book.textFileId))
        book.metaFileId &&
          promises.push(this.cloudAppFolder.remove(book.metaFileId))
        await Promise.allSettled(promises)
      }
      this.rootStore.notification.info('book remove sucess')
    } catch (e) {
      this.rootStore.notification.error('book remove error')
    } finally {
      this.isBookRemoving = false
    }
  })
}
