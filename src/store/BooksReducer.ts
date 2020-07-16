import React, { useCallback } from 'react'
import { getBookList, storeBook, updateBook } from '../uitls/database'
import { convertFB2ToHtml } from '../uitls/converter'
import { Book } from '../types'

const initialBooksState: Book[] = []
export type AppState = typeof initialBooksState

export default function useBooksReducer() {
  const memoizedReducer = useCallback(
    (state, action) => appReducer(state, action),
    []
  )
  const [state, dispatch] = React.useReducer(memoizedReducer, initialBooksState)
  function appReducer(state: AppState, action: any) {
    switch (action.type) {
      case 'set_books_list': {
        return action.payload
      }

      case 'add_book_to_list': {
        return [...state, action.payload]
      }

      case 'fetch_books_list': {
        getBookList().then((payload) =>
          dispatch({ type: 'set_books_list', payload })
        )
        return state
      }

      case 'add_book': {
        const { text, file } = action.payload
        addBookToDB(text, file).then((payload) =>
          dispatch({ type: 'add_book_to_list', payload })
        )
        return state
      }

      case 'update_book_position': {
        const { bookId, positionElement } = action.payload
        updateBook(bookId, { positionElement })
        return state.map((book) => {
          if (book.id === bookId) {
            return { ...book, ...{ positionElement } }
          }
          return book
        })
      }
    }
    return state
  }

  return [state, dispatch]
}

async function addBookToDB(text: string, file: File) {
  const html = await convertFB2ToHtml(text)
  return await storeBook(html.body.innerHTML, file)
}
