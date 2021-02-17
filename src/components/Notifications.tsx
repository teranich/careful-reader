import React, { useContext, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import RemoteLibraryStoreContext from '../store/RemoteLibraryStore'
import LibraryStoreContext from '../store/LibraryStore'
import { observer } from 'mobx-react'

const Notifications = observer(() => {
  const { isBooksLoading, isLoggedIn } = useContext(RemoteLibraryStoreContext)
  const { addBookAction, isBookExist, messages, books } = useContext(
    LibraryStoreContext
  )
  const [open, setOpen] = React.useState(true)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = (event: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isBooksLoading}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </>
  )
})
export default Notifications
