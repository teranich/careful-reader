import React from 'react'
import { observable, action } from 'mobx'
import libraryDB from '../uitls/clientDB' // getBookText, // updateBook, // storeBook, // getBookList,
import { BookList, Book } from '../types'
import { convertFB2ToHtml } from '../uitls/converter'

type CurrentBook = {
  meta: Book | null
  text: string
} | null

export const LibraryStore = () => {
  const fetchBooksListAction = action(async () => {
    store.books = await libraryDB.getAllMeta()
    console.log('books', store.books)
  })

  const addBookAction = action(async (rawBookText: string, file: File) => {
    const { documentBody, cover } = convertFB2ToHtml(rawBookText)
    const newBook = {
      name: file.name,
      cover,
      body: documentBody,
    }
    const book = await libraryDB.addBook(newBook)
    store.books.push(book)
  })

  const syncBookAction = action(async (meta: Book, body: string) => {
    const newBook = { ...meta, body }
    const book = await libraryDB.addBook(newBook)
    store.books.push(book)
  })

  const deleteBookAction = action(async (book: Book) => {
    await libraryDB.delete(book.id)
    const bookIndex = store.books.indexOf(book)
    store.books.splice(bookIndex, 1)
  })

  const updateBookPositionAction = action(
    async (bookId: number, positionElement: string) => {
      await libraryDB.setBookMeta(bookId, { positionElement })
    }
  )

  const updateBookAction = action(async (bookId: number, bookProps: any) => {
    const bookInStore = store.books.find((book) => book.id === bookId)
    if (bookInStore) {
      Object.assign(bookInStore, bookProps)
    }
    await libraryDB.setBookMeta(bookId, bookProps)
  })

  const openBookAction = action(async (bookId: number) => {
    if (store.currentBook!.meta!.id === bookId) return Promise.resolve()
    Promise.all([
      libraryDB.getBookMeta(bookId),
      libraryDB.getBookText(bookId),
    ]).then((prom) => {
      store.currentBook.meta = prom[0]
      store.currentBook.text = prom[1]
    })
  })

  const fetchBookTextAction = action(
    async (bookId: number) => await libraryDB.getBookText(bookId)
  )

  const store = observable({
    books: [] as BookList,
    remoteBooks: [] as BookList,
    currentBook: {
      meta: {} as Book | undefined,
      text: '' as string | undefined,
    },
    fetchBooksListAction,
    fetchBookTextAction,
    addBookAction,
    openBookAction,
    syncBookAction,
    deleteBookAction,
    updateBookAction,
    updateBookPositionAction,
  })

  return store
}
export default React.createContext<any>({})
