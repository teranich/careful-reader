import React, { useContext, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { observer } from 'mobx-react'
import { RootStoreContext } from '../store/RootStore'

const Notifications = observer(({ rootStore }: any) => {
  const { messages } = useContext(
    RootStoreContext
  )

  return (
    <>
      {messages.map((message: string, i: number) => (
        <Notification message={message} index={i} key={`notification-${i}`} />
      ))}
    </>
  )
})

const Notification = ({ message, index }: { message: string, index: number }) => {
  const [open, setOpen] = React.useState(true)
  const rootStore = useContext(
    RootStoreContext
  )
  const handleClose = (event: React.SyntheticEvent, reason?: string) => {
    setOpen(false)
    rootStore.removeNotification(index)
  }
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={3000}
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
