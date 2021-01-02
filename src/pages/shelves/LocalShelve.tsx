import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import { useHistory } from 'react-router-dom'
import Shelve, { TSheveAction } from './Shelve'
import LibraryStoreContext from '../../store/LibraryStore'
import RemoteLibraryStore from '../../store/RemoteLibraryStore'

const LocalBooksList = observer(() => {
  const history = useHistory()
  const { books, removeBookAction } = useContext(LibraryStoreContext)
  const { uploadBookAction } = useContext(RemoteLibraryStore)
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
      handler: (book) => {
        console.log('book', book)
        uploadBookAction(book)
      },
    },
  ]

  return (
    <>
      <Shelve
        books={books}
        dialogBookClickHandler={handleBookRead}
        actions={actions}
      />
    </>
  )
})

export default LocalBooksList
