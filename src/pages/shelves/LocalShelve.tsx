import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import LibraryStoreContext from '../../store/LibraryStore'
import { useHistory } from 'react-router-dom'
import Shelve, { TSheveAction } from './Shelve'

const LocalBooksList = observer(() => {
  const history = useHistory();
  const {
    books,
  } = useContext(LibraryStoreContext)
  const handleBookRead = (book: Book | null) => {
    book && history.push(`/read/${book.id}`)
  }
  const actions: TSheveAction[] = [{
    text: 'read',
    handler: handleBookRead
  }]

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