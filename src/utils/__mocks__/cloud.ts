//fix isolated-modules warnings
// @ts-ignore

const content: {[key: string]: any} = {
    'm1': JSON.stringify({
        id: '1',
        name: '22'
    })
}
const remoteBookFiles = [{
    id: 'b1'
}]

const remoteMetaFiles = [{
    id: 'm1'
}]

const cloud: any = jest.createMockFromModule('../cloud')

cloud.load = function () {
  return Promise.resolve()
}
cloud.isLoggedIn = function () {
  return Promise.resolve(true)
}

cloud.drive = {
  getOrCreate: {
    folder: async (query: string) => {
      return {}
    },
    file: async (query: string) => {
      return {}
    },
  },
  create: {
    folder: async (query: string) => {
      return {}
    },
    file: async (query: string) => {
      return {}
    },
  },
  find: {
    folder: async (query: string) => {
      return []
    },
    file: async (query: string) => {
        if (query === `name contains '-meta.json'`) {
          return remoteMetaFiles
        }
    },
  },
  upload: async (query: string) => {
    return {}
  },
  download: async (id: string) => {
    return content[id]
  },
  // remove,
}
cloud.appFolder = cloud.drive

module.exports = cloud
