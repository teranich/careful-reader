import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import { Link } from 'react-router-dom'
import './BookItem.scss'
import Paper from '@material-ui/core/Paper';

interface BookItemProps {
  book: Book
  onClick?: (book: Book) => void
  children?: any
}
const BookItem = observer(({ book, children, onClick, ...rest }: BookItemProps) => {
  return (
    <Paper className="book-item" elevation={3} onClick={() => onClick && onClick(book)}>
      { children}
      {
        book.cover ? (
          <>
            <img src={book.cover} alt="" />
          </>
        ) : (
            <div className="name">{book.name}</div>
          )
      }
    </Paper >
  )
})

export default BookItem