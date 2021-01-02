import { importScript } from './common'

interface Files {
  id: string
}

let loaded = false
async function loadGapi() {
  if (loaded) return true
  return importScript('https://apis.google.com/js/client:platform.js')
    .then(() => {
      return new Promise((resolve, reject) =>
        window.gapi.load('auth2', () => resolve(window.gapi.auth2))
      )
    })
    .then(() => {
      loaded = true
    })
    .catch(() => {
      console.error('google api is not loaded')
    })
}

let isGAPILoaded = false
const googleDriveAPIDocument =
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
const scope =
  'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.file'
export async function load() {
  if (isGAPILoaded) return
  await loadGapi()
  return new Promise((resolve, reject) => {
    return window.gapi.client
      .init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: [googleDriveAPIDocument],
        scope: scope,
      })
      .then(() => (isGAPILoaded = true))
      .then(resolve)
      .catch(reject)
  })
}

export async function signIn() {
  await load()
  try {
    return window.gapi.auth2.getAuthInstance().signIn()
  } catch (e) {
    console.error('error in signIn', e)
  }
}

export async function signOut() {
  await load()
  try {
    return window.gapi.auth2.getAuthInstance().signOut()
  } catch (e) {
    console.error('error in signOut', e)
  }
}

export async function isLoggedIn() {
  await load()
  try {
    return (
      window.gapi.auth2.getAuthInstance() &&
      window.gapi.auth2.getAuthInstance().isSignedIn.get()
    )
  } catch (e) {
    console.error('error in isLoggedIn', e)
    return false
  }
}
const folderMIME = 'application/vnd.google-apps.folder'
const fileMIME = 'text/plain'

const create = (type: string) => async (
  name: string,
  parents: string[] = ['appDataFolder']
) => {
  const mimeType = type === 'folder' ? folderMIME : fileMIME
  console.log('create', parents, type, name)
  const resp = await promisify(gapi.client.drive.files.create, {
    resource: {
      name,
      mimeType,
      parents,
    },
    fields: 'id',
  })
  return resp.result
}

const find = (type: string) => async (name: string) => {}

export const drive = {
  create: {
    folder: create('folder'),
    file: create('file'),
  },
  find: {
    folder: find('folder'),
  },
}

function promisify(
  gapiFn: any,
  options: any
): Promise<gapi.client.Response<Files>> {
  return new Promise((resolve, reject) => {
    return gapiFn(options).then(
      (resp: any) => {
        if (resp && (resp.status < 200 || resp.status > 299)) {
          console.error('GAPI call returned bad status', resp)
          reject(resp)
        } else {
          resolve(resp)
        }
      },
      (err: any) => {
        return reject(err)
      }
    )
  })
}

export let x = 0

export const inc = () => {
  return x++
}
