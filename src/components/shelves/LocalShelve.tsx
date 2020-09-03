import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import { BooksListPlaceholder } from './common'
import LibraryStoreContext from '../../store/LibraryStore'
import BookItem from '../common/BookItem'

const LocalBooksList = observer(() => {
  const {
    books
  } = useContext(LibraryStoreContext)

  return (
    <>
      {books.length ? (
        <div className="collection">
          {books.map((book: Book, index: number) => (
            <BookItem
              book={book}
              key={book.id}
              to={`/details/${book.id}`}>
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
