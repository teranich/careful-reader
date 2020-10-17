import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import LibraryStoreContext from '../../store/LibraryStore'
import BookItem from '../../components/common/BookItem'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom'


const gridStyle = {
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  paddingBottom: '10px'
}

const Spacer = () => (
  <Grid item xs={12} ><div style={{ height: '120px' }}></div></Grid>
)

const LocalBooksList = observer(() => {
  const history = useHistory();
  const {
    books,
  } = useContext(LibraryStoreContext)
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
  const handleBookRead = (book: Book | null) => {
    book && history.push(`/read/${book.id}`)
  }

  return (
    <>
      <Grid container justify="space-around">
        {books.map((book: Book, index: number) => (
          <Grid item key={book.id} style={gridStyle}>
            <BookItem
              book={book}
              onClick={bookClickHandler}
            />
          </Grid>
        ))}
        <Spacer />
      </Grid>
      <Dialog onClose={handleDialogClose} open={isBookDialogOpenned} fullWidth={true}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Grid container justify="center" spacing={2}>
            <Grid item >
              {selectedBook && (
                <BookItem
                  book={selectedBook}
                  onClick={handleBookRead}
                />
              )}
            </Grid>
            <Grid item xs={8}>
              <Typography display="block" noWrap={true}>{selectedBook?.name}</Typography>
            </Grid>
          </Grid>
        </DialogContent >
        <DialogActions>
          <Button onClick={() => handleBookRead(selectedBook)} color="primary">
            Read
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            Remove
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
})

export default LocalBooksList