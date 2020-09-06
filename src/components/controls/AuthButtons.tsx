import React, { useContext } from 'react'
import RemoteLibraryStoreContext from '../../store/RemoteLibraryStore'
import loginIcon from './login.svg'
import logoutIcon from './logout.svg'
import './Buttons.scss'
import { observer } from 'mobx-react'

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
        {isLoggedIn ? (
          <div className="logout-button" onClick={signOutAction}>
            <span>LogOut</span>
            <div><img src={logoutIcon} alt="" /></div>
          </div>
        ) : (
            <div className="login-button" onClick={signInAction}>
              <span>LogIn</span>
              <div><img src={loginIcon} alt="" /></div>
            </div>
          )}
      </div>
    </>
  )
})
