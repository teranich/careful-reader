import React, { useContext, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Alert from '@material-ui/lab/Alert';
import { observer } from 'mobx-react'
import { RootStoreContext } from '../store/RootStore'

const Notifications = observer(({ rootStore }: any) => {
  const { notifications } = useContext(
    RootStoreContext
  )

  return (
    <>
      {notifications.map(({ message, type }, i: number) => (
        <Notification message={message} index={i} type={type} key={`notification-${i}`} />
      ))}
    </>
  )
})

type TNotificationProps = { message: string, index: number, type: string }
const Notification = ({ message, index, type }: TNotificationProps) => {
  const [open, setOpen] = React.useState(true)
  const rootStore = useContext(
    RootStoreContext
  )
  const handleClose = (event: React.SyntheticEvent, reason?: string) => {
    setOpen(false)
    rootStore.removeNotification(index)
  }
  const getAlertClassForType = () => {
    const typeClassMap = {
      info: 'success',
      error: 'error'
    }
    //@ts-ignore
    return typeof type === 'string' ? typeClassMap[type] : 'success'
  }
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={getAlertClassForType()}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Notifications
