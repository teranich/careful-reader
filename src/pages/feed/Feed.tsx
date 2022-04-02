import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import { IBook } from '../../types'
import BookItem from '../../components/common/BookItem'
import BookShelfImage from './book-shelf.png'
import { Header } from '../../components/common'
import { useIntl } from 'react-intl'
import { RootStoreContext } from '../..//store/RootStore'

export default observer(function Feed() {
  const intl = useIntl()
  const { libraryStore } = useContext(
    RootStoreContext
  )
  
  return (
    <div className="feed">
      <Header></Header>
      <div className="content">
        Feed
      </div>
    </div>
  )
})

