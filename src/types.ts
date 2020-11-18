export interface Book {
  id: number
  meta?: any
  metaFileId?: string
  textFileId?: string
  name: string
  positionElement?: any
  cover: string
  timestamp?: number
}

export interface RemoteBook {
  id: string
  metaFileId?: string
  textFileId?: string
  name: string
}

export type BookList = Book[]
