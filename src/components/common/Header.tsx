import React from 'react'
import './Header.scss'
import useGoogleDrive from '../../uitls/googleAPI'

const Header: React.FC = ({ children }) => {
  const { isClientLoaded, isLoggedIn, signIn, signOut } = useGoogleDrive()
  return (
    <header className="header">
      {children}
      <div className={isClientLoaded ? '' : 'hidden'}>
        {isLoggedIn ? (
          <button onClick={signOut}>Log Out</button>
        ) : (
          <button onClick={signIn}>Log In</button>
        )}
      </div>
    </header>
  )
}

export default Header
