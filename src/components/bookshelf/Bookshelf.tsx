import React, { useContext, useEffect } from 'react'
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
      <label className="add-book-lable" htmlFor="btn-add-book">
        <img src="add-book.png" alt="" />
        <div className="add-book-text">add book</div>
        <input
          type="file"
          name=""
          id="btn-add-book"
          onChange={onChangeHandler}
          accept=".fb2"
        />
      </label>

      <ul className="collection">
        {books.map((book: Book) => (
          <li className="list-item" key={book.id}>
            <Link to={`/read/${book.id}`}>{book.name}</Link>
          </li>
        ))}
      </ul>
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
