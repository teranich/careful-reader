interface Files {
  id: string
}
export default class GAPI {
  private googleDriveAPIDocument =
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
  private scope = 'https://www.googleapis.com/auth/drive.appfolder'
  private isGAPILoaded = false
  constructor() {
    if (
      !process.env.REACT_APP_GOOGLE_API_KEY ||
      !process.env.REACT_APP_GOOGLE_CLIENT_ID
    ) {
      console.error('Missing google API keys in .env file', process.env)
    }
  }
  public async load() {
    await this.loadGoogleAPI()
    this.isGAPILoaded = true
    return new Promise((resolve, reject) => {
      if (window.gapi.client.drive) return resolve(null)
      return window.gapi.client
        .init({
          apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
          clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          discoveryDocs: [this.googleDriveAPIDocument],
          scope: this.scope,
        })
        .then(resolve)
        .catch(reject)
    })
  }
  public signIn() {
    try {
      return window.gapi.auth2.getAuthInstance().signIn()
    } catch (e) {
      return this.processError(e)
    }
  }
  public signOut() {
    try {
      return window.gapi.auth2.getAuthInstance().signOut()
    } catch (e) {
      return this.processError(e)
    }
  }
  public isLoggedIn() {
    return (
      this.isGAPILoaded &&
      window.gapi.auth2.getAuthInstance() &&
      window.gapi.auth2.getAuthInstance().isSignedIn.get()
    )
  }
  public async list(query: string = '') {
    let ret: any = []
    try {
      let token
      do {
        const resp: any = await this.callGapi(
          window.gapi.client.drive.files.list,
          {
            spaces: 'appDataFolder',
            fields: '*',
            pageSize: 100,
            pageToken: token,
            orderBy: 'createdTime',
            q: query,
          }
        )
        ret = ret.concat(resp.result.files)
        token = resp.result.nextPageToken
      } while (token)

      return ret
    } catch (e) {
      this.processError(e)
      return ret
    }
  }
  public async listFolders() {
    return await this.list(`mimeType = 'application/vnd.google-apps.folder'`)
  }
  public async upload(fileId: string, content: string) {
    try {
      return this.callGapi(gapi.client.request, {
        path: `/upload/drive/v3/files/${fileId}`,
        method: 'PATCH',
        params: { uploadType: 'media' },
        body: typeof content === 'string' ? content : JSON.stringify(content),
      })
    } catch (e) {
      this.processError(e)
    }
  }
  public async download(fileId: string) {
    const resp = await this.callGapi(gapi.client.drive.files.get, {
      fileId: fileId,
      alt: 'media',
    })
    return resp.result || resp.body
  }
  public async createFile(name: string, folderId?: string) {
    const resp = await this.callGapi(gapi.client.drive.files.create, {
      resource: {
        name: name,
        mimeType: 'text/plain',
        parents: [folderId || 'appDataFolder'],
      },
      fields: 'id',
    })
    return resp.result
  }
  public async createFolder(name: string) {
    const resp = await this.callGapi(gapi.client.drive.files.create, {
      resource: {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: ['appDataFolder'],
      },
      fields: 'id',
    })
    return resp.result
  }
  public async deleteFile(fileId: string) {
    try {
      await this.callGapi(gapi.client.drive.files.delete, {
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
  private loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (!window.gapi) return reject('google api is not loaded')
      if (window.gapi.auth2) resolve(window.gapi.auth2)
      window.gapi.load('auth2', () => resolve(window.gapi.auth2))
    })
  }

  private callGapi<CallGAPI>(
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
          // this.processError(err)
          return reject(err)
        }
      )
    })
  }
  private processError(error: Error) {
    console.error(error)
  }
}
