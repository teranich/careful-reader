import { action, makeAutoObservable } from 'mobx'
import { createContext } from 'react'
import { IBook } from 'src/types'
import AppStore from './AppStore'
import { LibraryStore } from './LibraryStore'
import RemoteLibraryStore from './RemoteLibraryStore'
import { GoogleProvider } from '../utils/cloud/GoogleProvider.class';
import { ICloudProvider } from 'src/utils/cloud/ICloudProvader.interface';

interface INotification {
  message: string
  type: string
}
export class RootStore {
  appStore: AppStore
  libraryStore: LibraryStore
  remoteLibraryStore: RemoteLibraryStore
  notifications: INotification[] = []
  isClientLoaded: boolean = false;
  isLoggedIn: boolean = false;
  private cloud: ICloudProvider = new GoogleProvider();
  public getCloud() {
    return this.cloud
  }
  public notification = {
    info: action((message: string) => {
      this.notifications.push({ message, type: 'info' })
    }),
    error: action((message: string) => {
      this.notifications.push({ message, type: 'error' })
    }),
  }
  syncMetaAction = action(async (book: IBook) => {
    return await this.remoteLibraryStore.syncMetaAction(book)
  })
  syncBookAction = action(async (book: IBook, body: string) => {
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

  async load() {
    try {
        await this.cloud.init();
        this.isClientLoaded = true;
        this.isLoggedIn = await this.cloud.isLoggedIn();
    } catch (e) {
        console.error('fail to load: ', e);
    }
}
signInAction = action(async () => {
  await this.cloud.signIn();
  this.isLoggedIn = await this.cloud.isLoggedIn();
});

signOutAction = action(async () => {
  await this.cloud.signOut();
  this.isLoggedIn = await this.cloud.isLoggedIn();
});
}

export const RootStoreContext = createContext<RootStore>({} as RootStore)
