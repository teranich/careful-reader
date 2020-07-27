import { BookList } from '../types'

export async function getBooksList(): Promise<BookList> {
  return fetch('db.json').then((resp) => resp.json())
}

export async function getBook(filePath: string): Promise<string> {
  return fetch(filePath).then((resp) => resp.text())
}

export function readFileContent(file: File): Promise<string> {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      return resolve(event?.target?.result + '')
    }
    reader.onerror = (error) => reject('error reading file')
    reader.readAsText(file)
  })
}

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced as (...args: Parameters<F>) => ReturnType<F>
}
