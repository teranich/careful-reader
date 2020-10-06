import React from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import { Link } from 'react-router-dom'
import './BookItem.scss'
import Paper from '@material-ui/core/Paper';

interface BookItemProps {
  book: Book
  to: string
  children?: any
}
const BookItem = observer(({ book, children, to, ...rest }: BookItemProps) => (
  <Paper className="book-item" elevation={3} >
    { children}
    < Link to={to} className="book-item" {...rest} >
      {
        book.cover ? (
          <>
            <img src={book.cover} alt="" />
          </>
        ) : (
            <div className="name">{book.name}</div>
          )
      }
    </Link >
  </Paper >
))

export default BookItem