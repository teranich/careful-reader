import React, { useContext } from 'react'
import './Shelves.scss'

import { Header } from '../common'
import { observer } from 'mobx-react'
import RemoteBooksList from './RemoteShelve'
import { AddBookButton } from './common'
import LocalBooksList from './LocalShelve'
import { Loading } from '../loading'
import LibraryStoreContext from '../../store/LibraryStore'

export default observer(function Shelves() {
  return (
    <>
      <Header></Header>
      <div className="book-shelf">
        <div className="container">
          <RemoteBooksList />
          <div> separator </div>
          <LocalBooksList />
        </div>
        <AddBookButton className="add-button-fixed" />
      </div>
    </>
  )
})
