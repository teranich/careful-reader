import React from 'react'
import { MainState, BookList, Book } from '../../types'
import { connect, useDispatch } from 'react-redux'
import { addBook } from '../../store/actions'
import { useHistory } from 'react-router-dom'
import { readFileContent } from '../../uitls/common'
import "./Bookshelf.scss"
interface IBookshelfProps {
    books?: BookList
}

function Bookshelf({ books = [] }: IBookshelfProps) {
    const dispatch = useDispatch()
    let history = useHistory();

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const file = event.target.files[0]
            readFileContent(file)
                .then((text: string) => {
                    dispatch(addBook(text, file))
                })
        }
    }

    const onClick = (bookId: number) => {
        history.push(`/read/${bookId}`)
    }

    return (
        <div className="book-shelf">

            <label className="add-book-lable" htmlFor="btn-add-book">
                <img src="/add-book.png" alt="" />
                <div className="add-book-text">add book</div>
                <input type="file" name="" id="btn-add-book"
                    onChange={onChangeHandler} accept=".fb2" />
            </label>


            <ul className="collection">
                {books.map((book: Book) => (
                    <li className="list-item" key={book.id} onClick={(event) => onClick(book.id)}>
                        <div>{book.name}</div> <div>{book.page}</div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
const mapStateToProps = (state: MainState) => {
    return {
        books: state.shelf.books
    }
}
export default connect(mapStateToProps, null)(Bookshelf)