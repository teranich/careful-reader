import { RootStore } from './RootStore'
import { action, makeAutoObservable } from 'mobx'
import libraryDB from '../uitls/clientDB'
import { BookList, Book } from '../types'
import * as converter from '../uitls/converter'

type TCurrentBook = null | {
  info: Book
  text: string
  meta: any
}
export class LibraryStore {
  public isAddingBookInProcess = false
  public isFetchingBooksInProcess = false

  public books: BookList = []
  public currentBook: TCurrentBook = null
  private rootStore: RootStore

  constructor(rootStore: RootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }
  fetchBooksListAction = action(async () => {
    this.isFetchingBooksInProcess = true
    this.books = await libraryDB.getAllMeta()
    this.isFetchingBooksInProcess = false
  })

  isBookExist = (name: string | undefined) =>
    this.books.find((book: Book) => book.name === name)

  addBookAction = action(async (rawBookText: string, name: string) => {
    const { cover, meta } = converter.getBookPreviewInfo(rawBookText)
    const newBook = {
      name,
      meta,
      cover,
    }

    this.isAddingBookInProcess = true
    const book = await libraryDB.addBook(newBook, rawBookText)
    this.books.push(book)
    this.isAddingBookInProcess = false
    this.rootStore.notification.info('book has been added')
  })

  syncBookAction = action(async (meta: Book, body: string) => {
    const book = await libraryDB.addBook(meta, body)
    this.books.push(book)
  })

  removeBookAction = action(async (book: Book | null) => {
    if (!book) return
    await libraryDB.delete(book.id)
    const bookIndex = this.books.indexOf(book)
    this.books.splice(bookIndex, 1)
    this.rootStore.notification.info('book has been removed')
  })

  updateBookPositionAction = action(
    async (bookId: number, positionElement: string) => {
      await libraryDB.updateBookMeta(bookId, { positionElement })
    }
  )

  updateBookAction = action(async (bookId: number, bookProps: any) => {
    const bookInStore = this.books.find((book) => book.id === bookId)
    if (bookInStore) {
      Object.assign(bookInStore, bookProps)
    }
    await libraryDB.updateBookMeta(bookId, bookProps)
  })

  openBookAction = action(async (bookId: number) => {
    if (this.currentBook && this.currentBook.info.id === bookId) {
      this.currentBook.info =
        (await libraryDB.getBookMeta(bookId)) || this.currentBook.info
      return Promise.resolve(this.currentBook)
    } else {
      return Promise.all([
        libraryDB.getBookMeta(bookId),
        libraryDB.getBookText(bookId),
      ]).then((prom) => {
        const info = prom[0] as Book
        const rawText = prom[1] || ''
        const text = converter.parseToInnerBook(rawText)

        this.currentBook = {
          info,
          text,
          meta: null,
        }
        console.log('open book action', this.currentBook)
        return this.currentBook
      })
    }
  })

  fetchBookTextAction = action(
    async (bookId: number) => await libraryDB.getBookText(bookId)
  )
}
