import {
  FETCH_BOOKS_LIST,
  BooksAction,
  BOOK_TEXT,
  ShelfState,
  ADD_BOOK,
  UPDATE_BOOK_POSITION,
} from '../types'

const initialState: ShelfState = {
  books: [],
  bookText: '',
}

export function ShelfReducer(state = initialState, action: BooksAction) {
  switch (action.type) {
    case ADD_BOOK:
      return { ...state, books: state.books.concat(action.payload) }
    case FETCH_BOOKS_LIST:
      return { ...state, books: action.payload }
    case BOOK_TEXT:
      return {
        ...state,
        bookText: action.payload,
      }
    case UPDATE_BOOK_POSITION:
      const newBook = action.payload
      const books = state.books.map((book) => {
        if (book.id === newBook.id) {
          return newBook
        }
        return book
      })

      return { ...state, books }
    default:
      return state
  }
}
