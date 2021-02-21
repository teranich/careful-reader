import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import { Loading } from '../../components/loading'
import Shelve, { TSheveAction } from './Shelve'
import { RootStoreContext } from '../..//store/RootStore'

const RemoteBooksList = observer(() => {
  const { libraryStore, remoteLibraryStore } = useContext(RootStoreContext)
  const {
    books,
    isBooksLoading,
    isLoggedIn,
    downloadBookAction,
    removeBookAction,
  } = remoteLibraryStore

  const { addBookAction, isBookExist } = libraryStore

  const collectBook = async (book: Book | null) => {
    if (isBookExist(book?.name)) {
      return
    }
    const text = await downloadBookAction(book)
    if (text && book) {
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
