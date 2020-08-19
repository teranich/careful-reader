import React, { useContext } from 'react'
import './Header.scss'
import RemoteLibraryStoreContext from '../../store/RemoteLibraryStore'
import { observer } from 'mobx-react'

export default observer(function Header({ children }: any) {
  // const { isClientLoaded, isLoggedIn, signIn, signOut } = useGoogleDrive()
  // @ts-ignore
  const {
    isClientLoaded,
    isLoggedIn,
    signInAction,
    signOutAction,
  } = useContext(RemoteLibraryStoreContext)
  return (
    <header className="header">
      {children}
      <div className={isClientLoaded ? '' : 'hidden'}>
        {isLoggedIn ? (
          <button onClick={signOutAction}>Log Out</button>
        ) : (
          <button onClick={signInAction}>Log In</button>
        )}
      </div>
    </header>
  )
})
