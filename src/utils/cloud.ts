import { importScript } from './common'

interface Files {
  id: string
}

let loaded = false
export async function loadGapi() {
  if (loaded) return true
  return importScript('https://apis.google.com/js/client:platform.js')
    .then(() => {
      return new Promise((resolve, reject) =>
        window.gapi.load('auth2', () => resolve(window.gapi.auth2))
      )
    })
    .then(() => {
      loaded = true
      return loaded
    })
    .catch(() => {
      console.error('google api is not loaded')
    })
}

let isGAPILoaded = false
const googleDriveAPIDocument =
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
const scope =
  'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive'
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

const create = (spaces: string) => (type: string) => async (
  name: string,
  folderId?: string
) => {
  const mimeType = type === 'folder' ? folderMIME : fileMIME
  const parents = folderId ? [folderId] : spaces === 'drive' ? [] : [spaces]
  const response = await promisify(gapi.client.drive.files.create, {
    resource: {
      name,
      mimeType,
      parents,
    },
    fields: '*',
  })
  return response.result
}

const find = (spaces: string) => (type: string) => async (query: string) => {
  const mimeType =
    type === 'folder'
      ? `and mimeType = '${folderMIME}'`
      : `and not mimeType = '${folderMIME}'`
  const q = `${query} ${mimeType}`
  let ret: any = []
  try {
    let token
    do {
      const response: any = await promisify(
        window.gapi.client.drive.files.list,
        {
          spaces,
          fields: '*',
          pageSize: 100,
          pageToken: token,
          orderBy: 'createdTime',
          q,
        }
      )
      ret = ret.concat(response.result.files)
      token = response.result.nextPageToken
    } while (token)

    return ret
  } catch (e) {
    console.error('can`t list items in drive with query: ', query, e)
  }
}

const download = async (fileId: string) => {
  const resp = await promisify(gapi.client.drive.files.get, {
    fileId: fileId,
    alt: 'media',
  })

  return resp.body
}
const remove = async (fileId: string) => {
  try {
    await promisify(gapi.client.drive.files.delete, {
      fileId: fileId,
    })
    return true
  } catch (err) {
    if (err.status === 404) {
      return false
    }
    throw err
  }
}

const getOrCreate = (spaces: string) => (type: string) => async (
  q: string,
  name: string,
  folderId?: string
) => {
  const exist = await find(spaces)(type)(q)
  return exist.length ? exist : [await create(spaces)(type)(name, folderId)]
}

const upload = (spaces: string) => async (fileId: string, content: string) => {
  try {
    const response: any = await promisify(gapi.client.request, {
      spaces: spaces === 'drive' ? [] : [spaces],
      path: `/upload/drive/v3/files/${fileId}`,
      method: 'PATCH',
      params: { uploadType: 'media' },
      body: typeof content === 'string' ? content : JSON.stringify(content),
    })
    return response.result
  } catch (e) {
    console.error('can`t upload file with: ', fileId, content, e)
  }
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

const createInDrive = create('drive')
const findInDrive = find('drive')
const getOrCreateInDrive = getOrCreate('drive')
const uploadInDrive = upload('drive')
export const drive = {
  getOrCreate: {
    folder: getOrCreateInDrive('folder'),
    file: getOrCreateInDrive('file'),
  },
  create: {
    folder: createInDrive('folder'),
    file: createInDrive('file'),
  },
  find: {
    folder: findInDrive('folder'),
    file: findInDrive('file'),
  },
  upload: uploadInDrive,
  download,
  remove,
}

const createInAppFolder = create('appDataFolder')
const findInAppFolder = find('appDataFolder')
const getOrCreateInAppFolder = getOrCreate('appDataFolder')
const uploadOnAppFolder = upload('appDataFolder')
export const appFolder = {
  getOrCreate: {
    foder: getOrCreateInAppFolder('folder'),
    file: getOrCreateInAppFolder('file'),
  },
  create: {
    folder: createInAppFolder('folder'),
    file: createInAppFolder('file'),
  },
  find: {
    folder: find('folder'),
    file: findInAppFolder('file'),
  },
  upload: uploadOnAppFolder,
  download,
  remove,
}
