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
  const { books: localBooks, updateBookAction, syncBookAction } = useContext(
    LibraryStoreContext
  )

  const collectBook = async (book: Book | null) => {
    const text = await downloadBookAction(book)
    // await syncBookAction(meta, text)
    console.log('collect book', book, text)
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
