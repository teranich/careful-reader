import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import BookItem from '../../components/common/BookItem'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'

type TShelveActionHandler = (book: Book | null) => void

const Spacer = styled.div`
  height: 56px;
  width: 100%;
`

export type TSheveAction = {
  text: string
  handler: TShelveActionHandler
}
interface TShelve {
  books: Book[]
  dialogBookClickHandler?: TShelveActionHandler
  actions: TSheveAction[]
}

const Shelve = observer(
  ({ books, actions, dialogBookClickHandler }: TShelve) => {
    const [isBookDialogOpenned, setIsBookDialogOpenned] = useState(false)
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const bookClickHandler = (book: Book) => {
      setIsBookDialogOpenned(true)
      setSelectedBook(book)
    }
    const handleDialogClose = () => {
      setIsBookDialogOpenned(false)
      setSelectedBook(null)
    }
    const handleBookAction = (action: TSheveAction) => {
      action.handler(selectedBook)
      handleDialogClose()
    }
    const handleDefaultAction = (book: Book) => dialogBookClickHandler && dialogBookClickHandler(book)

    return (
      <>
        <Box display="flex" justifyContent="center" flexWrap="wrap">
          {books.map((book: Book, index: number) => (
            <BookItem key={index} book={book}
              onSingleClick={() => bookClickHandler(book)}
              onDoubleClick={() => handleDefaultAction(book)}
            />
          ))}
          <Spacer />
        </Box>
        <Dialog
          onClose={handleDialogClose}
          open={isBookDialogOpenned}
          fullWidth={true}
        >
          <DialogTitle></DialogTitle>
          <DialogContent>
            <Grid container justify="center" spacing={2}>
              <Grid item>
                {selectedBook && (
                  <BookItem
                    book={selectedBook}
                    onSingleClick={() =>
                      handleDefaultAction(selectedBook)
                    }
                  />
                )}
              </Grid>
              <Grid item xs={8}>
                <Typography display="block" noWrap={true}>
                  {selectedBook?.name}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={() => handleBookAction(action)}
                color="primary"
              >
                {action.text}
              </Button>
            ))}
          </DialogActions>
        </Dialog>
      </>
    )
  }
)

export default Shelve
