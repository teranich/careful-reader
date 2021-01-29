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

export type BookList = Book[]
