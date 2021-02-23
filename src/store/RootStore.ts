import { action, makeAutoObservable } from 'mobx'
import { createContext } from 'react'
import AppStore from './AppStore'
import { LibraryStore } from './LibraryStore'
import RemoteLibraryStore from './RemoteLibraryStore'

interface INotification  {
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
  constructor() {
    makeAutoObservable(this)
    this.appStore = new AppStore(this)
    this.libraryStore = new LibraryStore(this)
    this.remoteLibraryStore = new RemoteLibraryStore(this)
  }

  removeNotification(index: number) {
    this.notifications.splice(index, 1)
  }
}

export const RootStoreContext = createContext<RootStore>({} as RootStore)
