import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { RemoteBook, Book } from '../../types'
import RemoteLibraryStoreContext from '../../store/RemoteLibraryStore'
import LibraryStoreContext from '../../store/LibraryStore'
import { Loading } from '../common'

const RemoteBooksList = observer(() => {
  const {
    books,
    fetchBooksListAction,
    isClientLoaded,
    isLoggedIn,
    downloadBookAction,
    deleteBookAction,
  } = useContext(RemoteLibraryStoreContext)
  const { books: localBooks, updateBookAction, syncBookAction } = useContext(
    LibraryStoreContext
  )
  const [isBooksLoading, setIsBooksLoading] = useState(false)

  const fetchBooks = async () => {
    setIsBooksLoading(true)
    if (isLoggedIn) await fetchBooksListAction()
    setIsBooksLoading(false)
  }

  const removeBtnHandler = async (book: RemoteBook) => {
    const isSuccess = await deleteBookAction(book)
    if (isSuccess) {
      const localBook: Book | null = localBooks.find(
        (localBook: Book) => localBook.metaFileId === book.metaFileId
      )
      if (localBook) {
        delete localBook.metaFileId
        await updateBookAction(localBook)
      }
    }
  }

  const collectBtnHandler = async (book: RemoteBook) => {
    const text = await downloadBookAction(book)
    await syncBookAction(book, text)
  }

  useEffect(() => {
    fetchBooks()
  }, [isLoggedIn])

  return (
    <>
      <div className={`collection ${!isLoggedIn ? 'hidden' : ''}`}>
        <button onClick={fetchBooks}>reload</button>
        {isBooksLoading && <Loading />}
        {!isBooksLoading &&
          books.map((book: RemoteBook, index: number) => (
            <div key={index + book.name}>
              {book.name}
              <button onClick={() => removeBtnHandler(book)}>del</button>
              <button onClick={() => collectBtnHandler(book)}>collect</button>
            </div>
          ))}
      </div>
    </>
  )
})
export default RemoteBooksList
