import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../../components/common'
import { observer } from 'mobx-react'
import LibraryStoreContext from '../../store/LibraryStore'
import { Book } from '../../types'
import BookItem from '../../components/common/BookItem'
// import './Details.scss'
import RemoteLibraryStoreContext from '../../store/RemoteLibraryStore'

interface QueryParams {
  bookId: string
}

const Details = () => {
  const queryParams = useParams<QueryParams>()
  const bookId = parseInt(queryParams.bookId)
  const {
    books,
    updateBookAction,
    removeBookAction,
    fetchBookTextAction,
  } = useContext(LibraryStoreContext)
  const { uploadBookAction, syncMetaAction } = useContext(
    RemoteLibraryStoreContext
  )
  const [book, setBook] = useState<Book>()

  useEffect(() => {
    const book: Book = books.find((b: Book) => b.id === bookId)
    setBook(book)
  }, [books, bookId])

  const uploadHandler = async (book: Book) => {
    const text = await fetchBookTextAction(book.id)
    const file = await uploadBookAction(book, text)
    await updateBookAction(book.id, { ...book })
  }

  const deleteBookHandler = async (book: Book) => {
    await removeBookAction(book)
  }

  const syncHandler = async (book: Book) => {
    if (book.metaFileId) {
      await syncMetaAction(book)
    } else {
      const text = await fetchBookTextAction(book.id)
      const file = await uploadBookAction(book, text)
    }

  }
  return (
    <div className="details">
      <Header></Header>
      {book &&
        <section className="content">
          <div>{book.name}</div>
          <BookItem book={book} />
          <div className="info">
            <div className="controls">
              <button onClick={() => syncHandler(book)}>sync </button>
              <button onClick={() => uploadHandler(book)}>upload</button>
              <button
                onClick={() => {
                  deleteBookHandler(book)
                }}
              >
                del
              </button>
              <button>info</button>
              <div />
              <div>{book.metaFileId}</div>
            </div>
          </div>
        </section>
      }
    </div>
  )
}

export default observer(Details)