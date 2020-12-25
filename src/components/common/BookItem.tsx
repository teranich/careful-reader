import React from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import Paper from '@material-ui/core/Paper'
import styled from 'styled-components'

const Container = styled(Paper)`
  width: 115px;
  height: 185px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-all;
  padding: 5px;
  margin: 5px;
`
const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
`
interface BookItemProps {
  book: Book
  onClick?: (book: Book) => void
  children?: any
}
const BookItem = observer(
  ({ book, children, onClick, ...rest }: BookItemProps) => {
    return (
      <Container elevation={3} onClick={() => onClick && onClick(book)}>
        {children}
        {book.cover ? (
          <>
            <Image src={book.cover} alt="" />
          </>
        ) : (
          <div>{book.name}</div>
        )}
      </Container>
    )
  }
)

export default BookItem
