import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import LibraryStoreContext from '../../store/LibraryStore'
import BookItem from '../../components/common/BookItem'
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

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
  const {
    books,
  } = useContext(LibraryStoreContext)

  return (
    <>
      <CssBaseline />
      <Grid container justify="space-around">
        {books.map((book: Book, index: number) => (
          <Grid item key={book.id} style={gridStyle}>
            <BookItem
              book={book}
              to={`/details/${book.id}`}>
            </BookItem>
          </Grid>
        ))}
        <Spacer />
      </Grid>
    </>
  )
})

export default LocalBooksList

// {books.length ? (
//   <div className="collection1">
    // <Loading loading={isAddingBookInProcess}>
    //   {books.map((book: Book, index: number) => (
    //     <BookItem
    //       book={book}
    //       key={book.id}
    //       to={`/details/${book.id}`}>
    //     </BookItem>
    //   ))}
    // </Loading>

//   </div>
// ) : (
//     <BooksListPlaceholder />
//   )}