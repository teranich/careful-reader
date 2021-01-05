import React from 'react'
import { observable, action } from 'mobx'
import { createIntl, createIntlCache } from 'react-intl'

import en_messages from '../translations/locales/en.json'
import ru_messages from '../translations/locales/ru.json'
import * as cloud from '../uitls/cloud'

export const AppStore = () => {
  const globalIntlCache = createIntlCache()

  createIntl({ locale: 'ru', messages: ru_messages }, globalIntlCache)
  createIntl({ locale: 'en', messages: en_messages }, globalIntlCache)

  const defaultLocale = 'en'
  const messages = {
    en: en_messages,
    ru: ru_messages,
  } as {
    [key: string]: any
  }

  const setLocale = action((locale: string) => {
    if (Object.keys(messages).includes(locale)) {
      store.locale = locale
    } else {
      throw Error('Unsupported locale')
    }
  })

  const getLocaleMessages = action(() => {
    const locale = store.locale
    return messages[locale]
  })

  const toggleHightligting = action((value: boolean) => {
    store.wordsHighlight = value
  })

  const toggleDynamicTextOrientation = action((value: boolean) => {
    store.dynamicTextOrientation = value
  })

  const setPageColor = action((value: string) => {
    store.pageColor = value
  })

  const setPageBackgroundImage = action((value: string) => {
    store.pageBackgroundImage = value
  })

  cloud.load().then((x) => {
    store.isClientLoaded = true
    cloud.isLoggedIn().then((isLoggedIn) => (store.isLoggedIn = isLoggedIn))
  })

  const signInAction = action(async () => {
    await cloud.signIn()
    store.isLoggedIn = await cloud.isLoggedIn()
  })

  const signOutAction = action(async () => {
    await cloud.signOut()
    store.isLoggedIn = await cloud.isLoggedIn()
    // store.books = []
  })

  const store = observable({
    defaultLocale,
    locale: defaultLocale,
    wordsHighlight: true,
    dynamicTextOrientation: false,
    pageColor: 'white',
    pageBackgroundImage: 'none',
    messages,
    isLoggedIn: false,
    isClientLoaded: false,
    signInAction,
    signOutAction,
    toggleHightligting,
    toggleDynamicTextOrientation,
    setLocale,
    setPageColor,
    setPageBackgroundImage,
    getLocaleMessages,
  })

  return store
}
export default React.createContext<any>({})
