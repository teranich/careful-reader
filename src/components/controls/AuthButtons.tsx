import React, { useContext } from 'react'
import AppStoreContext from '../../store/AppStore'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'

export default observer(function SignInButton() {
  const {
    isClientLoaded,
    isLoggedIn,
    signInAction,
    signOutAction,
  } = useContext(AppStoreContext)
  return (
    <>
      {isClientLoaded && (
        <>
          {isLoggedIn ? (
            <Button onClick={signOutAction} color="inherit">
              LogOut
            </Button>
          ) : (
            <Button onClick={signInAction} color="inherit">
              Login
            </Button>
          )}
        </>
      )}
    </>
  )
})
