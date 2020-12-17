import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import { RemoteBook, Book } from '../../types'
import RemoteLibraryStoreContext from '../../store/RemoteLibraryStore'
import LibraryStoreContext from '../../store/LibraryStore'
import { Loading } from '../../components/loading'

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

  const removeBtnHandler = async (book: RemoteBook) => {
    const isSuccess = await removeBookAction(book)
    if (isSuccess) {
      const localBook: Book | null = localBooks.find(
        (localBook: Book) => localBook.metaFileId === book.metaFileId
      )
      if (localBook) {
        delete localBook.metaFileId
        await updateBookAction(localBook.id, { metaFileId: null })
      }
    }
  }

  const collectBtnHandler = async (remoteBook: RemoteBook) => {
    const { meta, text } = await downloadBookAction(remoteBook)
    await syncBookAction(meta, text)
  }

  return (
    <>
      <div className={`collection ${!isLoggedIn ? 'hidden' : ''}`}>
        <Loading loading={isBooksLoading}>
          {books.map((book: RemoteBook, index: number) => (
            <div key={book.id}>
              <div>{book.id}: {book.name}</div>
              <button onClick={() => removeBtnHandler(book)}>del</button>
              <button onClick={() => collectBtnHandler(book)}>collect</button>
            </div>
          ))}
        </Loading>
      </div>
    </>
  )
})
export default RemoteBooksList
