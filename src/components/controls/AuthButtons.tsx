import React, { useContext } from 'react'

import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import { RootStoreContext } from '../../store/RootStore'

export default observer(function SignInButton() {
  const rootStore = useContext(RootStoreContext)
  const {
    isClientLoaded,
    isLoggedIn,
    signInAction,
    signOutAction,
  } = rootStore
  
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
