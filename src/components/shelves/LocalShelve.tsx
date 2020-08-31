import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import { BooksListPlaceholder } from './common'
import LibraryStoreContext from '../../store/LibraryStore'
import RemoteLibraryStoreContext from '../../store/RemoteLibraryStore'
import BookItem from '../common/BookItem'

const LocalBooksList = observer(() => {
  const {
    books,
    updateBookAction,
    deleteBookAction,
    fetchBookTextAction,
  } = useContext(LibraryStoreContext)
  // @ts-ignore
  const { uploadBookAction, syncMetaAction } = useContext(
    RemoteLibraryStoreContext
  )

  const uploadHandler = async (book: Book) => {
    const text = await fetchBookTextAction(book.id)
    const file = await uploadBookAction(book, text)
    console.log('after download', book)
    await updateBookAction(book.id, { ...book })
  }

  const deleteBookHandler = async (book: Book) => {
    await deleteBookAction(book)
  }

  const syncHandler = async (book: Book) => {
    if (book.metaFileId) {
      await syncMetaAction(book)
    } else {
      const text = await fetchBookTextAction(book.id)
      const file = await uploadBookAction(book, text)
      console.log('after download', book, file)
    }

    console.log('synced')
  }

  return (
    <>
      {books.length ? (
        <div className="collection">
          {books.map((book: Book, index: number) => (
            <BookItem
              book={book}
              key={book.id}
              to={`/details/${book.id}`}>
              <>
                <button onClick={() => syncHandler(book)}>sync </button>
                <button onClick={() => uploadHandler(book)}>upload</button>
              </>
              <div>{book.metaFileId}</div>
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
