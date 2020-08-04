import React, { useCallback } from 'react'
import { getBookList, storeBook, updateBook } from '../uitls/clientDB'
import { convertFB2ToHtml } from '../uitls/converter'
import { Book } from '../types'

const initialBooksState: Book[] = []
export type AppState = typeof initialBooksState

export default function useLibraryReducer() {
  const memoizedReducer = useCallback(
    (state, action) => libraryReducer(state, action),
    []
  )
  const [state, dispatch] = React.useReducer(memoizedReducer, initialBooksState)
  function libraryReducer(state: AppState, action: any) {
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

async function addBookToDB(rawBookText: string, file: File) {
  const { dicumentBody, cover } = await convertFB2ToHtml(rawBookText)

  return await storeBook({
    name: file.name,
    text: dicumentBody.innerHTML,
    cover,
  })
}
