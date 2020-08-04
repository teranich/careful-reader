import { useState, useEffect } from 'react'

function loadGoogleAPI() {
  return new Promise((resolve, reject) => {
    if (!window.gapi) return reject('google api is not loaded')
    if (window.gapi.auth2) resolve(window.gapi.auth2)
    window.gapi.load('auth2', () => resolve(window.gapi.auth2))
  })
}

function loadGoogleDriveAPI() {
  const googleDriveAPIDocument =
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
  const scope = 'https://www.googleapis.com/auth/drive.appfolder'

  return window.gapi.client.init({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    discoveryDocs: [googleDriveAPIDocument],
    scope,
  })
}
interface Files {
  id: string
}

interface CallGAPI {
  gapiFn: Function
  options: Object
}

function callGapi<CallGAPI>(
  gapiFn: any,
  options: any
): Promise<gapi.client.Response<Files>> {
  return new Promise((resolve, reject) => {
    return gapiFn(options).then(
      (resp: any) => {
        if (resp && (resp.status < 200 || resp.status > 299)) {
          console.log('GAPI call returned bad status', resp)
          reject(resp)
        } else {
          resolve(resp)
        }
      },
      (err: any) => {
        console.log('GAPI call failed', err)
        reject(err)
      }
    )
  })
}

async function createFile(name: string) {
  const resp = await callGapi(gapi.client.drive.files.create, {
    resource: {
      name: name,
      mimeType: 'text/plain',
      parents: ['appDataFolder'],
    },
    fields: 'id',
  })
  return resp.result.id
}

async function list(query: string = '') {
  let ret: any = []
  let token
  do {
    const resp: any = await callGapi(gapi.client.drive.files.list, {
      spaces: 'appDataFolder',
      fields: 'files(id, name), nextPageToken',
      pageSize: 100,
      pageToken: token,
      orderBy: 'createdTime',
      q: query,
    })
    ret = ret.concat(resp.result.files)
    token = resp.result.nextPageToken
  } while (token)

  return ret
}

async function upload(fileId: string, body: string) {
  return callGapi(gapi.client.request, {
    path: `/upload/drive/v3/files/${fileId}`,
    method: 'PATCH',
    params: { uploadType: 'media' },
    body,
  })
}

export default function useGoogleDrive() {
  const [isClientLoaded, setIsClientLoaded] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const updateLogedInState = () => {
    const isLoggedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get()
    setIsLoggedIn(isLoggedIn)
  }

  useEffect(() => {
    loadGoogleAPI()
      .then(loadGoogleDriveAPI)
      .then(() => {
        setIsClientLoaded(true)
        updateLogedInState()
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(() => {
          updateLogedInState()
        })
      })
  }, [window.gapi])

  const signIn = () => {
    window.gapi.auth2.getAuthInstance().signIn()
  }
  const signOut = () => window.gapi.auth2.getAuthInstance().signOut()
  const googleDriveAPI = {
    create: createFile,
    list,
    upload,
  }
  return { isClientLoaded, isLoggedIn, signIn, signOut, googleDriveAPI }
}
