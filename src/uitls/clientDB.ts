import { openDB, DBSchema } from 'idb'
import { Book } from '../types'

const DB_VERSION = 1
const DB_NAME = 'library'
const DB_INDEX_NAME = 'index'
const DB_STORE_NAME = 'books'

interface LibraryDB extends DBSchema {
  [DB_INDEX_NAME]: {
    key: number
    value: Book
  }
  [DB_STORE_NAME]: {
    key: number
    value: string
  }
}

const dbPromise = openDB<LibraryDB>(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      db.createObjectStore(DB_INDEX_NAME, { keyPath: 'id' })
      db.createObjectStore(DB_STORE_NAME, { autoIncrement: true })
    }
  },
})

const txPromise = async () =>
  (await dbPromise).transaction([DB_INDEX_NAME, DB_STORE_NAME], 'readwrite')

const libraryDB = {
  async getBookMeta(id: number) {
    return (await dbPromise).get(DB_INDEX_NAME, id)
  },
  async getAllMeta() {
    return (await dbPromise).getAll(DB_INDEX_NAME)
  },
  async getBookText(id: number) {
    return (await dbPromise).get(DB_STORE_NAME, id)
  },
  async addBook(meta: any, body: string = ''): Promise<Book> {
    const timestamp = Date.now()
    const tx = await txPromise()
    const id = await tx.objectStore(DB_STORE_NAME).add(body)
    const book: Book = { ...meta, id, timestamp }
    await tx.objectStore(DB_INDEX_NAME).add(book)
    await tx.done
    return book
  },
  async setBookMeta(bookId: number, newBook: any) {
    const tx = await txPromise()
    const store = tx.objectStore(DB_INDEX_NAME)
    const oldBook = await store.get(bookId)
    await store.put({ ...oldBook, ...newBook })
    await tx.done
  },
  async delete(bookId: number) {
    const tx = await txPromise()
    await tx.objectStore(DB_INDEX_NAME).delete(bookId)
    await tx.objectStore(DB_STORE_NAME).delete(bookId)
    await tx.done
  },
  async clear() {
    const tx = await txPromise()
    await tx.objectStore(DB_INDEX_NAME).clear()
    await tx.objectStore(DB_STORE_NAME).clear()
    await tx.done
  },
}

export default libraryDB
