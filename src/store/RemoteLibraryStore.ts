import React from 'react'
import { observable, action } from 'mobx'
import { Book, RemoteBook } from '../types'
import * as cloud from '../uitls/cloud'
import libraryDB from '../uitls/clientDB'

export const RemoteLibraryStore = () => {
  const remoteFolderName = 'careful-reader'
  const initLibrary = action(async () => {
    cloud.drive.create.folder('books-folder')
  })
  cloud.load().then(() => {
    store.isClientLoaded = true
    cloud.isLoggedIn().then((isLoggedIn) => (store.isLoggedIn = isLoggedIn))
  })
  const cloudAppFolder = cloud.appFolder
  const cloudDrive = cloud.drive

  const fetchBooksListAction = action(async () => {
    store.isBooksLoading = true
    // store.books = await gapi.list(`fileExtension="json"`)
    store.isBooksLoading = false
  })

  const uploadBookAction = action(async (book: Book) => {
    store.isUploading = true
    const [currentFolder] = await cloudDrive.getOrCreateInDrive.folder(
      `name = '${remoteFolderName}'`,
      remoteFolderName
    )
    const [currentFile] = await cloudDrive.getOrCreateInDrive.file(
      `name = '${book.name}' and '${currentFolder.id}' in parents`,
      book.name,
      currentFolder.id
    )
    const bookText = await libraryDB.getBookText(book.id)
    const result = await cloudDrive.upload(currentFile.id, bookText)
    store.isUploading = false
    return result
  })

  const syncMetaAction = action(async (book: Book) => {
    // if (book.metaFileId) {
    //   await gapi.upload(book.metaFileId, JSON.stringify(book))
    // }
  })

  const downloadBookAction = action(async (book: RemoteBook) => {
    // const meta: any = await gapi.download(book.id)
    // let text: any = ''
    // if (meta.textFileId) text = await gapi.download(meta.textFileId)
    // return { meta, text }
  })

  const removeBookAction = action(async (book: any) => {
    // const isSuccess = await gapi.deleteFile(book.id)
    // if (isSuccess) {
    //   store.books = store.books.filter((inner) => inner.id !== book.id)
    // }
    // return isSuccess
  })

  const store = observable({
    books: [] as RemoteBook[],
    isClientLoaded: false,
    isLoggedIn: false,
    isBooksLoading: false,
    isUploading: false,
    initLibrary,
    uploadBookAction,
    syncMetaAction,
    downloadBookAction,
    removeBookAction,
    fetchBooksListAction,
  })

  return store
}
export default React.createContext<any>({})
