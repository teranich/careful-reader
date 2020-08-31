import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../common'
import { observer } from 'mobx-react'
import LibraryStoreContext from '../../store/LibraryStore'
import { Book } from '../../types'
import BookItem from '../common/BookItem'
import './Details.scss'

interface QueryParams {
  bookId: string
}

const Details = () => {
  const queryParams = useParams<QueryParams>()
  const bookId = parseInt(queryParams.bookId)
  const {
    books,
  } = useContext(LibraryStoreContext)

  const [currentBook, setCurrentBook] = useState<Book>()

  useEffect(() => {
    const book: Book = books.find((b: Book) => b.id === bookId)
    setCurrentBook(book)
  }, [books, bookId])

  return (
    <>
      <Header></Header>
      {currentBook &&
        <div>
          <BookItem book={currentBook} to={`/read/${currentBook.id}`} />
          {currentBook.name}
        </div>
      }
    </>
  )
}

export default observer(Details)