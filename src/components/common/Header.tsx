import React, { useState, useEffect } from 'react'
import './Header.scss'

function useGoogleAuth() {
  const [loaded, setLoaded] = useState(false)
  const [googleAuth, setGoogleAuth] = useState<gapi.auth2.GoogleAuth>()

  useEffect(() => {
    window.gapi?.load('auth2', () => {
      window.gapi?.auth2
        .init({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.appdata',
        })
        .then(oauth2ok, oauth2Error)
    })

    function oauth2ok(auth2: gapi.auth2.GoogleAuth) {
      if (auth2) {
        setGoogleAuth(auth2)
        setLoaded(true)
      }
    }

    function oauth2Error() {}
  }, [])

  const signIn = () => googleAuth?.signIn()
  const signOut = () => googleAuth?.signOut()

  return { signIn, signOut, loaded }
}

function useGoogleDrive() {}

const Header: React.FC = ({ children }) => {
  const { signIn, signOut, loaded } = useGoogleAuth()

  return (
    <header className="header">
      {children}
      <div className={loaded ? '' : 'hidden'}>
        <button onClick={signIn}>LogIn</button>
        <button onClick={signOut}>LogOut</button>
      </div>
    </header>
  )
}

export default Header
