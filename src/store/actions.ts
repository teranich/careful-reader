import { ADD_BOOK, FETCH_BOOKS_LIST, UPDATE_BOOK_POSITION } from '../types'
import {
  getBookList,
  storeBook,
  updateBook,
  getBookText as getBookTextFromStore,
} from '../uitls/database'
import { convertFB2ToHtml } from '../uitls/converter'
import { stylize } from '../uitls/styler'

export function addBook<IBook>(text: string, fileMeta: File) {
  return async (dispatch: Function) => {
    const html = await convertFB2ToHtml(text)
    stylize(html)
    const payload = await storeBook(html.body.innerHTML, fileMeta)
    dispatch({
      type: ADD_BOOK,
      payload,
    })
  }
}

export function getBookText(id: number) {
  return (dispatch: Function) => {
    getBookTextFromStore(id).then((payload) =>
      dispatch({
        type: 'BOOK_TEXT',
        payload,
      })
    )
  }
}

export function fetchBooksList() {
  return (dispatch: Function) => {
    getBookList().then((payload) =>
      dispatch({
        type: FETCH_BOOKS_LIST,
        payload,
      })
    )
  }
}

export function updateBookPosition(bookId: number, page: number) {
  return (dispatch: Function) => {
    updateBook(bookId, { page }).then((payload) =>
      dispatch({
        type: UPDATE_BOOK_POSITION,
        payload,
      })
    )
  }
}
