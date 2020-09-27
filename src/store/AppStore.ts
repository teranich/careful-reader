import React from 'react'
import { observable, action } from 'mobx'
import { createIntl, createIntlCache } from 'react-intl'

import en_messages from '../translations/locales/en.json'
import ru_messages from '../translations/locales/ru.json'

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

  const store = observable({
    defaultLocale,
    locale: defaultLocale,
    setLocale,
    messages,
    getLocaleMessages,
  })

  return store
}
export default React.createContext<any>({})
