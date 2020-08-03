import { useState, useEffect } from 'react'
const googleDriveAPIDocument =
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
const scope = 'https://www.googleapis.com/auth/drive.appfolder'

export default function useGoogleDrive() {
  const [isClientLoaded, setIsClientLoaded] = useState<boolean>(false)
  const getLogedInState = () => {
    return window.gapi.auth2.getAuthInstance().isSignedIn.get()
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    window.gapi?.load('auth2', () => {
      window.gapi?.client
        .init({
          apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
          clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          discoveryDocs: [googleDriveAPIDocument],
          scope,
        })
        .then((args) => {
          gapi.auth2.getAuthInstance().isSignedIn.listen(onSignIn)
          onSignIn()
          setIsClientLoaded(true)
        })
    })

    function onSignIn() {
      setIsLoggedIn(getLogedInState())
    }
  }, [window.gapi])

  const signIn = () => gapi.auth2.getAuthInstance().signIn()
  const signOut = () => gapi.auth2.getAuthInstance().signOut()

  return { isClientLoaded, isLoggedIn, signIn, signOut }
}
