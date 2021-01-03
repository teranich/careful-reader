import React from 'react'
import { observable, action } from 'mobx'
import { Book, RemoteBook } from '../types'
import * as cloud from '../uitls/cloud'

export const RemoteLibraryStore = () => {
  const remoteFolderName = 'careful-reader'
  const initLibrary = action(async () => {
    cloud.drive.create.folder('books-folder')
  })
  cloud.load().then(() => {
    store.isClientLoaded = true
    cloud.isLoggedIn().then((isLoggedIn) => (store.isLoggedIn = isLoggedIn))
  })

  const fetchBooksListAction = action(async () => {
    store.isBooksLoading = true
    // store.books = await gapi.list(`fileExtension="json"`)
    store.isBooksLoading = false
  })

  const uploadBookAction = action(async (book: Book, bookText: string) => {
    // const res = await cloud.drive.create.folder(remoteFolderName)
    // const res = await cloud.drive.create.file('2')
    const res = await cloud.drive.find.file(`fileExtension = 'fb2'`)
    console.log('res', res, book, bookText)
    // const list = await gapi.list(`name="${book.name}-text.html"`)
    // if (list.length) return
    // const [metaFile, textFile] = await Promise.all([
    //   gapi.createFile(`${book.name}-meta.json`),
    //   gapi.createFile(`${book.name}-text.html`),
    // ])
    // book.metaFileId = metaFile.id
    // book.textFileId = textFile.id
    // await Promise.all([
    //   gapi.upload(metaFile.id, JSON.stringify(book)),
    //   gapi.upload(textFile.id, bookText),
    // ])
    // const newBook: RemoteBook = {
    //   id: metaFile.id,
    //   metaFileId: metaFile.id,
    //   textFileId: textFile.id,
    //   name: `${book.name}-meta.json`,
    // }
    // store.books.push(newBook)
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
