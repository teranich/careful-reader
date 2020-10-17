import React, { useContext } from 'react'
import RemoteLibraryStoreContext from '../../store/RemoteLibraryStore'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button';

export default observer(function SignInButton() {
  const {
    isClientLoaded,
    isLoggedIn,
    signInAction,
    signOutAction,
  } = useContext(RemoteLibraryStoreContext)
  return (
    <>
      <div className={isClientLoaded ? 'auth-buttons' : 'hidden'}>
        {isLoggedIn ?
          (<Button onClick={signOutAction} color="inherit">LogOut</Button>) :
          (<Button onClick={signInAction} color="inherit">Login</Button>)
        }
      </div>
    </>
  )
})
