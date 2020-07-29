import React, { useContext } from 'react'
import { BookList, Book } from '../../types'
import { Link } from 'react-router-dom'
import { readFileContent } from '../../uitls/common'
import './Bookshelf.scss'
import { DispatchContext } from '../../App'
interface IBookshelfProps {
  books?: BookList
}

export default function Bookshelf({ books = [] }: IBookshelfProps) {
  const dispatch = useContext(DispatchContext)

  return (
    <div className="book-shelf">
      <div className="collection">
        {books.map((book: Book) => (
          <BookItem book={book} key={book.id} />
        ))}
      </div>
      <label className="add-book-lable" htmlFor="btn-add-book">
        <img src="add-book.png" alt="" />
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

  function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      const file = event.target.files[0]
      readFileContent(file).then((text: string) => {
        const payload = {
          text,
          file,
        }
        dispatch({ type: 'add_book', payload })
      })
    }
  }
}
interface BookItemProps {
  book: Book
}
const BookItem = ({ book, ...rest }: BookItemProps) => (
  <Link to={`/read/${book.id}`} className="book-item" {...rest}>
    <div className="name">{book.name}</div>
  </Link>
)
