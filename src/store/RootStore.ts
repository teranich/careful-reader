import { action, makeObservable, observable } from 'mobx'
import { createContext } from 'react'
import AppStore from './AppStore'
import { LibraryStore } from './LibraryStore'
import RemoteLibraryStore from './RemoteLibraryStore'

export class RootStore {
  somePropUsedInOtherStores = 'hello'
  appStore: AppStore
  libraryStore: LibraryStore
  remoteLibraryStore: RemoteLibraryStore

  messages: string[] = []

  constructor() {
    makeObservable(this, {
      messages: observable,
    })
    this.appStore = new AppStore(this)
    this.libraryStore = new LibraryStore(this)
    this.remoteLibraryStore = new RemoteLibraryStore(this)
  }

  notification = action((message: string) => {
    this.messages.push(message)
  })
  removeNotification(index: number) {
    console.log('notif', index, this.messages)
    this.messages.splice(index, 1)
  }
  
}

export const RootStoreContext = createContext<RootStore>({} as RootStore)
