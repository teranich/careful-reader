import React from 'react'
import { observable, action } from 'mobx'
import { createIntl, createIntlCache } from 'react-intl'

export const AppStore = () => {
  // const fetchBooksListAction = action(async () => {
  //   store.books = await libraryDB.getAllMeta()
  //   console.log('books', store.books)
  // })

  const globalIntlCache = createIntlCache()

  const enIntl = createIntl({ locale: 'en' }, globalIntlCache)
  const ruIntl = createIntl({ locale: 'ru' }, globalIntlCache)

  const setLocale = action((locale: string) => {
    store.locale = locale
  })
  const store = observable({
    locale: 'en',
    setLocale,
  })

  return store
}
export default React.createContext<any>({})
