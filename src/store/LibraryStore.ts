import React from 'react'
import { observable, action } from 'mobx'
import libraryDB from '../uitls/clientDB'
import { BookList, Book } from '../types'
import * as converter from '../uitls/converter'

export const LibraryStore = () => {
  const fetchBooksListAction = action(async () => {
    store.books = await libraryDB.getAllMeta()
    console.info('book store', store.books)
  })

  const isBookExist = (name: string) =>
    store.books.find((book: Book) => book.name === name)

  const addBookAction = action(async (rawBookText: string, name: string) => {
    const { cover, meta } = converter.getBookPreviewInfo(rawBookText)
    const newBook = {
      name,
      meta,
      cover,
    }

    store.isAddingBookInProcess = true
    const book = await libraryDB.addBook(newBook, rawBookText)
    store.books.push(book)
    store.isAddingBookInProcess = false
  })

  const syncBookAction = action(async (meta: Book, body: string) => {
    const book = await libraryDB.addBook(meta, body)
    store.books.push(book)
  })

  const removeBookAction = action(async (book: Book) => {
    await libraryDB.delete(book.id)
    const bookIndex = store.books.indexOf(book)
    store.books.splice(bookIndex, 1)
  })

  const updateBookPositionAction = action(
    async (bookId: number, positionElement: string) => {
      await libraryDB.updateBookMeta(bookId, { positionElement })
    }
  )

  const updateBookAction = action(async (bookId: number, bookProps: any) => {
    const bookInStore = store.books.find((book) => book.id === bookId)
    if (bookInStore) {
      Object.assign(bookInStore, bookProps)
    }
    await libraryDB.updateBookMeta(bookId, bookProps)
  })

  const openBookAction = action(async (bookId: number) => {
    if (store.currentBook!.info!.id === bookId) {
      store.currentBook.info = await libraryDB.getBookMeta(bookId)
      return Promise.resolve()
    }
    return Promise.all([
      libraryDB.getBookMeta(bookId),
      libraryDB.getBookText(bookId),
    ]).then((prom) => {
      store.currentBook.info = prom[0]
      const text = prom[1] || ''
      store.currentBook.text = converter.parseToInnerBook(text)
    })
  })

  const fetchBookTextAction = action(
    async (bookId: number) => await libraryDB.getBookText(bookId)
  )

  const store = observable({
    books: [] as BookList,
    remoteBooks: [] as BookList,
    currentBook: {
      info: {} as Book | undefined,
      text: '' as string | undefined,
    },
    isAddingBookInProcess: false,
    fetchBooksListAction,
    fetchBookTextAction,
    addBookAction,
    openBookAction,
    syncBookAction,
    removeBookAction,
    updateBookAction,
    updateBookPositionAction,
    isBookExist,
  })

  return store
}
export default React.createContext<any>({})
