import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import RemoteLibraryStoreContext from '../../store/RemoteLibraryStore'
import LibraryStoreContext from '../../store/LibraryStore'
import { Loading } from '../../components/loading'
import Shelve, { TSheveAction } from './Shelve'

const RemoteBooksList = observer(() => {
  const {
    books,
    isBooksLoading,
    isLoggedIn,
    downloadBookAction,
    removeBookAction,
  } = useContext(RemoteLibraryStoreContext)

  const { addBookAction, isBookExist } = useContext(LibraryStoreContext)

  const collectBook = async (book: Book | null) => {
    if (isBookExist(book?.name)) {
      console.log('Book exist', book?.name)
      return
    }
    const text = await downloadBookAction(book)
    if (text) {
      addBookAction(text, book?.name)
    }
  }
  const actions: TSheveAction[] = [
    {
      text: 'remove',
      handler: removeBookAction,
    },
    {
      text: 'collect',
      handler: collectBook,
    },
  ]

  console.log('cloud books', books)
  return (
    <>
      <div className={`collection ${!isLoggedIn ? 'hidden' : ''}`}>
        <Loading loading={isBooksLoading}>
          <Shelve
            books={books}
            dialogBookClickHandler={collectBook}
            actions={actions}
          />
        </Loading>
      </div>
    </>
  )
})
export default RemoteBooksList
