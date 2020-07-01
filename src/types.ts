export interface Book {
  id: number
  name: string
  page: number
  author?: string
  meta?: string
}

export type BookList = Book[]

export interface BooksAction {
  type: string
  payload: any
}

export const FETCH_BOOKS_LIST = 'FETCH_BOOKS_LIST'
export const ADD_BOOK = 'ADD_BOOK'
export const BOOK_TEXT = 'BOOK_TEXT'
export const UPDATE_BOOK_POSITION = 'UPDATE_BOOK_POSITION'

export interface BooksState {
  list: BookList
}

export interface ShelfState {
  books: BookList
  bookText: string
  currentBook?: {
    text: string
    meta: string
  }
}

export interface AppState {}

export interface MainState {
  shelf: ShelfState
  app: AppState
}
