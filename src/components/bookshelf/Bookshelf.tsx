import React, { useContext, useEffect } from 'react'
import { BookList, Book } from '../../types'
import { Link } from 'react-router-dom'
import { readFileContent } from '../../uitls/common'
import './Bookshelf.scss'
import AddBookIcon from './add-book.png'
import { Header } from '../common'
import LibraryStoreContext from '../../store/LibraryStore'
import { observer } from 'mobx-react'
interface BookshelfProps {
  books?: BookList
}

export default observer(function Bookshelf() {
  // @ts-ignore
  const { books, fetchBooksListAction } = useContext(LibraryStoreContext)
  useEffect(() => {
    fetchBooksListAction()
  }, [fetchBooksListAction])
  return (
    <>
      <Header></Header>
      <div className="book-shelf">
        {books.length ? (
          <div className="collection">
            {books.map((book: Book, index: number) => (
              <BookItem book={book} key={index + book.id} />
            ))}
          </div>
        ) : (
          <BooksListPlaceholder />
        )}
        <AddBookButton className="add-button-fixed" />
      </div>
    </>
  )
})

const AddBookButton = observer(({ ...rest }: any) => {
  // @ts-ignore
  const { addBookAction } = useContext(LibraryStoreContext)
  function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      const file = event.target.files[0]
      readFileContent(file).then((text: string) => {
        addBookAction(text, file)
      })
    }
  }

  return (
    <div {...rest}>
      <label className="add-book-lable" htmlFor="btn-add-book">
        <img src={AddBookIcon} alt="" />
        <input
          type="file"
          name=""
          id="btn-add-book"
          onChange={onChangeHandler}
          accept=".fb2"
        />
      </label>
    </div>
  )
})

interface BookItemProps {
  book: Book
}
const BookItem = observer(({ book, ...rest }: BookItemProps) => (
  <Link to={`/read/${book.id}`} className="book-item" {...rest}>
    {book.cover ? (
      <img src={book.cover} alt="" />
    ) : (
      <div className="name">{book.name}</div>
    )}
  </Link>
))

const BooksListPlaceholder = observer(() => (
  <div className="book-list-placeholder">
    <div className="centered">
      <div>
        Welcome! You haven't uploaded any books yet. Careful Reader supports
        <strong>&nbsp;fb2&nbsp;</strong>
        ones.
      </div>
      <AddBookButton className="add-btn-placeholder" />
    </div>
  </div>
))
