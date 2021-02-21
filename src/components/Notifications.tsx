import React, { useContext, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { inject, observer } from 'mobx-react'
import { RootStoreContext } from '../store/RootStore'

const Notifications = observer(({ rootStore }: any) => {
  const { messages } = useContext(
    RootStoreContext
  )

  return (
    <>
      {messages.map((message: string, i: number) => (
        <Notification message={message} key={`notification-${i}`} />
      ))}
    </>
  )
})

const Notification = ({ message }: { message: string }) => {
  const [open, setOpen] = React.useState(true)

  const handleClose = (event: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
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
  )
}

export default Notifications
