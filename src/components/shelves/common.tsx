import { observer } from 'mobx-react'
import { readFileContent } from '../../uitls/common'
import React, { useContext } from 'react'
import { Book } from '../../types'
import { Link } from 'react-router-dom'
import AddBookIcon from './add-book.png'
import LibraryStoreContext from '../../store/LibraryStore'
import RemoteLibraryStoreContext from '../../store/RemoteLibraryStore'

const AddBookButton = observer(({ ...rest }: any) => {
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
  children?: any
}
const BookItem = observer(({ book, children, ...rest }: BookItemProps) => (
  <div>
    {children}
    <Link to={`/read/${book.id}`} className="book-item" {...rest}>
      {book.cover ? (
        <>
          <img src={book.cover} alt="" />
        </>
      ) : (
        <div className="name">{book.name}</div>
      )}
    </Link>
  </div>
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

export { AddBookButton, BooksListPlaceholder, BookItem }
