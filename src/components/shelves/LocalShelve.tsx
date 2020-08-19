import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import { BookItem, BooksListPlaceholder } from './common'
import LibraryStoreContext from '../../store/LibraryStore'
import RemoteLibraryStoreContext from '../../store/RemoteLibraryStore'

const LocalBooksList = observer(() => {
  const {
    books,
    fetchBooksListAction,
    updateBookAction,
    deleteBookAction,
    fetchBookTextAction,
  } = useContext(LibraryStoreContext)
  // @ts-ignore
  const { uploadBookAction } = useContext(RemoteLibraryStoreContext)
  useEffect(() => {
    fetchBooksListAction()
    console.count('local')
  }, [fetchBooksListAction])

  const syncHandler = async (book: Book) => {
    const text = await fetchBookTextAction(book.id)
    const file = await uploadBookAction(book, text)
    console.log('after download', book)
    await updateBookAction(book.id, { ...book })
  }
  const deleteBookHandler = async (book: Book) => {
    await deleteBookAction(book)
  }
  return (
    <>
      {books.length ? (
        <div className="collection">
          {books.map((book: Book, index: number) => (
            <BookItem book={book} key={index + book.id}>
              {book.metaFileId ? (
                'synced'
              ) : (
                <button onClick={() => syncHandler(book)}>sync</button>
              )}

              <button
                onClick={() => {
                  deleteBookHandler(book)
                }}
              >
                del
              </button>
              <button>info</button>
            </BookItem>
          ))}
        </div>
      ) : (
        <BooksListPlaceholder />
      )}
    </>
  )
})

export default LocalBooksList
