import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import { useHistory } from 'react-router-dom'
import Shelve, { TSheveAction } from './Shelve'
import { RootStoreContext } from '../..//store/RootStore'

const LocalBooksList = observer(() => {
  const history = useHistory()
  const { libraryStore, remoteLibraryStore } = useContext(RootStoreContext)
  const { books, removeBookAction } = libraryStore
  const { uploadBookAction, syncMetaAction } = remoteLibraryStore
  const handleBookRead = (book: Book | null) => {
    book && history.push(`/read/${book.id}`)
  }

  const actions: TSheveAction[] = [
    {
      text: 'remove',
      handler: removeBookAction,
    },
    {
      text: 'read',
      handler: handleBookRead,
    },
    {
      text: 'upload',
      handler: uploadBookAction,
    },
    {
      text: 'sync',
      handler: syncMetaAction
    }
  ]

  return (
      <Shelve
        books={books}
        dialogBookClickHandler={handleBookRead}
        actions={actions}
      />
  )
})

export default LocalBooksList
