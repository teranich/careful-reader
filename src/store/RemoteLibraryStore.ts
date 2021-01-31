import React from 'react'
import { observable, action } from 'mobx'
import { Book } from '../types'
import * as cloud from '../uitls/cloud'
import libraryDB from '../uitls/clientDB'

export const RemoteLibraryStore = () => {
  const remoteFolderName = 'careful-reader'
  const initLibrary = action(async () => {
    cloud.drive.create.folder('books-folder')
  })
  cloud.load().then(() => {
    store.isClientLoaded = true
    cloud.isLoggedIn().then((isLoggedIn) => (store.isLoggedIn = isLoggedIn))
  })
  const cloudAppFolder = cloud.appFolder
  const cloudDrive = cloud.drive
  const fetchBooksListAction = action(async () => {
    store.isBooksLoading = true
    const cloudFiles = await cloudAppFolder.find.file(
      `name contains '-meta.json'`
    )
    const contentPromises = cloudFiles.map((fileMeta: { id: string }) =>
      cloudAppFolder.download(fileMeta.id).then((content) => {
        //@ts-ignore
        const book: Book = content
        store.books.push(book)
      })
    )
    store.books = []
    await Promise.all(contentPromises)
    store.isBooksLoading = false
  })

  const uploadBookAction = action(async (book: Book) => {
    store.isUploading = true
    const [currentFolder] = await cloudDrive.getOrCreate.folder(
      `name = '${remoteFolderName}'`,
      remoteFolderName
    )
    const [currentFile] = await cloudDrive.getOrCreate.file(
      `name = '${book.name}' and '${currentFolder.id}' in parents`,
      book.name,
      currentFolder.id
    )
    const bookText = await libraryDB.getBookText(book.id)
    const { id: textFileId } = await cloudDrive.upload(currentFile.id, bookText)
    const updatedBookMeta = await libraryDB.updateBookMeta(book.id, {
      textFileId,
    })
    const result = await syncMetaAction(updatedBookMeta)

    store.isUploading = false
    return result
  })

  const syncMetaAction = action(async (book: Book) => {
    store.isUploading = true
    const metaFileName = book.name + '-meta.json'
    const [currentFile] = await cloudAppFolder.getOrCreate.file(
      `name = '${metaFileName}'`,
      metaFileName
    )
    const { id: metaFileId } = await cloudAppFolder.upload(
      currentFile.id,
      JSON.stringify(book)
    )
    const result = await libraryDB.updateBookMeta(book.id, { metaFileId })
    store.isUploading = false
    return result
  })

  const downloadBookAction = action(async (book: Book) => {
    console.log('wtf', book)
    if (book.textFileId) {
      const result = await cloudDrive.download(book.textFileId)
      console.log('result', result)
    }

    // const meta: any = await gapi.download(book.id)
    // let text: any = ''
    // if (meta.textFileId) text = await gapi.download(meta.textFileId)
    // return { meta, text }
  })

  const removeBookAction = action(async (book: Book) => {
    const promises = []
    book.textFileId && promises.push(cloudDrive.remove(book.textFileId))
    book.metaFileId && promises.push(cloudAppFolder.remove(book.metaFileId))
    const result = await Promise.all(promises)
    console.log('remove', result)
    // const isSuccess = await gapi.deleteFile(book.id)
    // if (isSuccess) {
    //   store.books = store.books.filter((inner) => inner.id !== book.id)
    // }
    // return isSuccess
  })

  const store = observable({
    books: [] as Book[],
    isClientLoaded: false,
    isLoggedIn: false,
    isBooksLoading: false,
    isUploading: false,
    initLibrary,
    uploadBookAction,
    syncMetaAction,
    downloadBookAction,
    removeBookAction,
    fetchBooksListAction,
  })

  return store
}
export default React.createContext<any>({})
