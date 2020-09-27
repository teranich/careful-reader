import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import { BooksListPlaceholder } from './common'
import LibraryStoreContext from '../../store/LibraryStore'
import BookItem from '../../components/common/BookItem'
import { Loading } from '../../components/loading'

const LocalBooksList = observer(() => {
  const {
    books,
    isAddingBookInProcess
  } = useContext(LibraryStoreContext)

  return (
    <>
      {books.length ? (
        <div className="collection">
          <Loading loading={isAddingBookInProcess}>
            {books.map((book: Book, index: number) => (
              <BookItem
                book={book}
                key={book.id}
                to={`/details/${book.id}`}>
              </BookItem>
            ))}
          </Loading>

        </div>
      ) : (
          <BooksListPlaceholder />
        )}
    </>
  )
})

export default LocalBooksList
