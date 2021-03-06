import { action, makeAutoObservable } from 'mobx'
import { createContext } from 'react'
import { Book } from 'src/types'
import AppStore from './AppStore'
import { LibraryStore } from './LibraryStore'
import RemoteLibraryStore from './RemoteLibraryStore'

interface INotification {
  message: string
  type: string
}
export class RootStore {
  appStore: AppStore
  libraryStore: LibraryStore
  remoteLibraryStore: RemoteLibraryStore
  notifications: INotification[] = []
  public notification = {
    info: action((message: string) => {
      this.notifications.push({ message, type: 'info' })
    }),
    error: action((message: string) => {
      this.notifications.push({ message, type: 'error' })
    }),
  }
  syncMetaAction = action(async (book: Book) => {
    return await this.remoteLibraryStore.syncMetaAction(book)
  })
  syncBookAction = action(async (book: Book, body: string) => {
    return await this.libraryStore.syncBookAction(book, body)
  })
  constructor() {
    makeAutoObservable(this)
    this.appStore = new AppStore(this)
    this.remoteLibraryStore = new RemoteLibraryStore(this)
    this.libraryStore = new LibraryStore(this)
  }

  removeNotification(index: number) {
    this.notifications.splice(index, 1)
  }
}

export const RootStoreContext = createContext<RootStore>({} as RootStore)
