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
  'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file'
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

const create = (parents: string[]) => (type: string) => async (
  name: string
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

const list = async (query: string = '') => {
  let ret: any = []
  try {
    let token
    do {
      const resp: any = await promisify(window.gapi.client.drive.files.list, {
        spaces: 'drive',
        fields: '*',
        pageSize: 100,
        pageToken: token,
        orderBy: 'createdTime',
        q: query,
      })
      ret = ret.concat(resp.result.files)
      token = resp.result.nextPageToken
    } while (token)

    return ret
  } catch (e) {
    console.error('can`t list items in drive with query: ', query, e)
  }
}

const find = (spaces: string) => (type: string) => async (query: string) => {
  const mimeType =
    type === 'folder'
      ? `and mimeType = '${folderMIME}'`
      : `and not mimeType = '${folderMIME}'`
  const q = `${query} ${mimeType}`
  console.log(q)
  let ret: any = []
  try {
    let token
    do {
      const resp: any = await promisify(window.gapi.client.drive.files.list, {
        spaces,
        fields: '*',
        pageSize: 100,
        pageToken: token,
        orderBy: 'createdTime',
        q,
      })
      ret = ret.concat(resp.result.files)
      token = resp.result.nextPageToken
    } while (token)

    return ret
  } catch (e) {
    console.error('can`t list items in drive with query: ', query, e)
  }
}

const createInDrive = create([])
const findInDrive = find('drive')
export const drive = {
  create: {
    folder: createInDrive('folder'),
    file: createInDrive('file'),
  },
  find: {
    folder: findInDrive('folder'),
    file: findInDrive('file'),
  },
}

const createInAppFolder = create(['appDataFolder'])
export const appFolder = {
  create: {
    folder: createInAppFolder('folder'),
    file: createInAppFolder('file'),
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
