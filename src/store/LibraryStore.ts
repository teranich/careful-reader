import React from 'react'
import { observable, action } from 'mobx'
import {
  getBookList,
  storeBook,
  updateBook,
  getBookText,
} from '../uitls/clientDB'
import { BookList, Book } from '../types'
import { convertFB2ToHtml } from '../uitls/converter'

type CurrentBook = {
  meta: Book | null
  text: string
} | null

export const LibraryStore = () => {
  const fetchBooksListAction = action(async () => {
    const fetchedBooks = await getBookList()
    // @ts-ignore
    store.books.splice(0, store.books.length, ...fetchedBooks)
  })

  const addBookAction = action(async (rawBookText: string, file: File) => {
    const { dicumentBody, cover } = await convertFB2ToHtml(rawBookText)

    return await storeBook({
      name: file.name,
      text: dicumentBody.innerHTML,
      cover,
    })
  })

  const removeBookAction = action(async (book: Book) => {
    const bookIndex = store.books.indexOf(book)
    store.books.slice(bookIndex, 1)
  })

  const updateBookPositionAction = action(
    async (bookId: number, positionElement: string) => {
      updateBook(bookId, { positionElement })
      const currentReadableBook = store.books.find((book) => book.id === bookId)
      if (currentReadableBook)
        currentReadableBook.positionElement = positionElement
    }
  )

  const getBookTextAction = action(getBookText)

  const openBookAction = action(async (bookId: number) => {
    if (store.currentBook?.meta?.id === bookId) return Promise.resolve()
    await store.fetchBooksListAction()
    const meta = store.books.filter((book: Book) => book.id === bookId)
    return meta.length
      ? getBookText(bookId).then((text: string) => {
          store.currentBook!.meta = meta[0]
          store.currentBook!.text = text
        })
      : Promise.reject({ err: `Book with id: ${bookId} not found` })
  })

  const store = observable({
    books: [] as BookList,
    getBookTextAction,
    currentBook: { meta: null, text: '' } as CurrentBook,
    fetchBooksListAction,
    addBookAction,
    openBookAction,
    removeBookAction,
    updateBookPositionAction,
  })

  return store
}
// @ts-ignore
export default React.createContext()
