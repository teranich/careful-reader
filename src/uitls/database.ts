import { openDB, DBSchema } from 'idb'

interface ILibrarySchema extends DBSchema {
  index: {
    key: string
    value: {}
  }
}

const DB_VERSION = 1
const DB_NAME = 'library'
const DB_INDEX_NAME = 'index'
const DB_STORE_NAME = 'books'

async function init() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(DB_INDEX_NAME, { keyPath: 'id' })
      db.createObjectStore(DB_STORE_NAME, { autoIncrement: true })
    },
  })
}

async function storeBook(text: string, fileMeta: File) {
  const db = await openDB(DB_NAME, DB_VERSION)
  const tx = db.transaction([DB_INDEX_NAME, DB_STORE_NAME], 'readwrite')
  const primaryKey = await tx.objectStore(DB_STORE_NAME).add(text)
  const record = {
    id: primaryKey,
    name: fileMeta.name,
    page: 0,
  }

  tx.objectStore(DB_INDEX_NAME).add(record)
  await tx.done
  return record
}

async function updateBook(bookId: number, book: any) {
  const db = await openDB(DB_NAME, DB_VERSION)
  const objectStore = db
    .transaction([DB_INDEX_NAME], 'readwrite')
    .objectStore(DB_INDEX_NAME)
  return objectStore.get(bookId).then((oldBook) => {
    const newBook = {
      ...oldBook,
      ...book,
    }
    return objectStore.put(newBook).then(() => newBook)
  })
}

async function getBookList() {
  const db = await openDB(DB_NAME, DB_VERSION)
  return db.getAll(DB_INDEX_NAME)
}

async function getBookText(id: number) {
  const db = await openDB(DB_NAME, DB_VERSION)
  return db.get(DB_STORE_NAME, id)
}

export { init, storeBook, getBookList, getBookText, updateBook }
