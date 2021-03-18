import { RootStore } from './RootStore'
import { action, makeAutoObservable, toJS } from 'mobx'
import libraryDB from '../utils/clientDB'
import { BookList, Book } from '../types'
import * as converter from '../utils/converter'

export type TCurrentBook =
  | {
      info: Book
      text: string
    }
  | undefined
export class LibraryStore {
  public isAddingBookInProcess = false
  public isFetchingBooksInProcess = false
  public books: BookList = []
  public lastBook: TCurrentBook

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
    const { id, ...rest } = meta
    const metaWithoutObserving = toJS(rest)
    metaWithoutObserving.meta = toJS(metaWithoutObserving.meta)
    const book = await libraryDB.addBook(metaWithoutObserving, body)
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
    async (book: Book, positionElement: string) => {
      const bookId = book.id
      await libraryDB.updateBookMeta(bookId, { positionElement })
      book.positionElement = positionElement
      await this.rootStore.syncMetaAction(book)
    }
  )

  updateBookAction = action(async (bookId: number, bookProps: any) => {
    const bookInStore = this.books.find((book) => book.id === bookId)
    if (bookInStore) {
      Object.assign(bookInStore, bookProps)
    }
    await libraryDB.updateBookMeta(bookId, bookProps)
  })

  openBookAction = action(
    async (bookId: number): Promise<TCurrentBook> => {
      if (this.lastBook && this.lastBook.info.id === bookId) {
        this.lastBook.info =
          (await libraryDB.getBookMeta(bookId)) || this.lastBook.info
        return Promise.resolve(this.lastBook)
      } else {
        return Promise.all([
          libraryDB.getBookMeta(bookId),
          libraryDB.getBookText(bookId),
        ]).then((prom) => {
          const info = prom[0] as Book
          const rawText = prom[1] || ''
          const text = converter.parseToInnerBook(rawText)

          this.lastBook = {
            info,
            text,
          }
          return this.lastBook
        })
      }
    }
  )

  fetchBookTextAction = action(
    async (bookId: number) => await libraryDB.getBookText(bookId)
  )
}
