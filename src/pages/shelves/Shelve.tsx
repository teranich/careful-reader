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

const Spacer = () => (
  <Grid item xs={12}>
    <div style={{ height: '120px' }}></div>
  </Grid>
)

type TShelveActionHandler = (book: Book | null) => void

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

    return (
      <>
        <Grid container justify="center">
          {books.map((book: Book, index: number) => (
            <Grid item key={index} xl={1} md={2} sm={3} xs={6}>
              <BookItem book={book} onClick={bookClickHandler} />
            </Grid>
          ))}
          <Spacer />
        </Grid>
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
                    onClick={() =>
                      dialogBookClickHandler &&
                      dialogBookClickHandler(selectedBook)
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
