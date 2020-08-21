import React from 'react'
import GAPI from '../uitls/googleAPI'
import { observable, action } from 'mobx'
import { BookList, Book, RemoteBook } from '../types'

export const RemoteLibraryStore = () => {
  const gapi = new GAPI()

  const fetchBooksListAction = action(async () => {
    store.books = await gapi.list(`fileExtension="json"`)
  })

  const signInAction = action(async () => {
    await gapi.signIn()
    store.isLoggedIn = gapi.isLoggedIn()
  })

  const signOutAction = action(async () => {
    await gapi.signOut()
    store.isLoggedIn = gapi.isLoggedIn()
    store.books = []
  })

  const uploadBookAction = action(async (book: Book, bookText: string) => {
    const list = await gapi.list(`name="${book.name}-text.html"`)
    if (list.length) return

    const [metaFile, textFile] = await Promise.all([
      gapi.createFile(`${book.name}-meta.json`),
      gapi.createFile(`${book.name}-text.html`),
    ])

    book.metaFileId = metaFile.id
    book.textFileId = textFile.id
    await Promise.all([
      gapi.upload(metaFile.id, JSON.stringify(book)),
      gapi.upload(textFile.id, bookText),
    ])

    const newBook: RemoteBook = {
      id: metaFile.id,
      metaFileId: metaFile.id,
      textFileId: textFile.id,
      name: `${book.name}-meta.json`,
    }
    store.books.push(newBook)
  })

  const syncMetaAction = action(async (book: Book) => {
    if (book.metaFileId) {
      await gapi.upload(book.metaFileId, JSON.stringify(book))
    }
  })

  const downloadBookAction = action(async (book: RemoteBook) => {
    const meta: any = await gapi.download(book.id)
    let text: any = ''
    if (meta.textFileId) text = await gapi.download(meta.textFileId)
    return { meta, text }
  })

  const deleteBookAction = action(async (book: any) => {
    const isSuccess = await gapi.deleteFile(book.id)
    if (isSuccess) {
      store.books = store.books.filter((inner) => inner.id !== book.id)
    }
    return isSuccess
  })

  const store = observable({
    books: [] as RemoteBook[],
    isClientLoaded: false,
    isLoggedIn: false,
    signInAction,
    signOutAction,
    uploadBookAction,
    syncMetaAction,
    downloadBookAction,
    deleteBookAction,
    fetchBooksListAction,
  })

  gapi
    .load()
    .then(() => {
      store.isClientLoaded = true
      store.isLoggedIn = gapi.isLoggedIn()
    })
    .catch((err) => {
      console.error('error is', err)
    })
  return store
}
export default React.createContext<any>({})
