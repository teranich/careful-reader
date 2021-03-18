import { observer } from 'mobx-react'
import { readFileContent } from '../../utils/common'
import React, { useContext } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { RootStoreContext } from '../../store/RootStore';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    right: 0,
    bottom: theme.spacing(8),
  },
  fab: {
    right: theme.spacing(2),
  },
  input: {
    display: 'none'
  }
}));

const AddBookButton = observer(({ ...rest }: any) => {
  const { libraryStore: { addBookAction } } = useContext(RootStoreContext)
  const theme = useTheme();
  const classes = useStyles(theme)

  function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      const file = event.target.files[0]
      readFileContent(file).then((text: string) => {
        addBookAction(text, file.name)
      })
    }
  }

  return (
    <label className={classes.container} {...rest} htmlFor="btn-add-book">
      <input
        type="file"
        name=""
        id="btn-add-book"
        onChange={onChangeHandler}
        accept=".fb2"
        className={classes.input}
      />
      <Fab
        color="primary"
        component="span"
        className={classes.fab}>
        <AddIcon />
      </Fab>

    </label>
  )
})


const BooksListPlaceholder = observer(() => (
  <div className="book-list-placeholder">
    <div className="centered">
      <div>
        Welcome! You haven't uploaded any books yet. Careful Reader supports
        <strong>&nbsp;fb2&nbsp;</strong>
        ones.
      </div>
      <AddBookButton className="add-btn-placeholder" />
    </div>
  </div>
))

export { AddBookButton, BooksListPlaceholder }
