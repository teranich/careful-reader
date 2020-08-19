import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react'
import { RemoteBook, Book } from '../../types'
import RemoteLibraryStoreContext from '../../store/RemoteLibraryStore'
import LibraryStoreContext from '../../store/LibraryStore'

const RemoteBooksList = observer(() => {
  const {
    books,
    fetchBooksListAction,
    isClientLoaded,
    downloadBookAction,
    deleteBookAction,
  } = useContext(RemoteLibraryStoreContext)
  const { books: localBooks, updateBookAction, syncBookAction } = useContext(
    LibraryStoreContext
  )

  const reloadBtnHandler = () => {
    isClientLoaded && fetchBooksListAction()
  }
  const removeBtnHandler = async (book: RemoteBook) => {
    const isSuccess = await deleteBookAction(book)
    if (isSuccess) {
      const localBook: Book | null = localBooks.find(
        (localBook: Book) => localBook.metaFileId === book.metaFileId
      )
      if (localBook) {
        console.log('updatiiing', localBook)
        delete localBook.metaFileId
        await updateBookAction(localBook)
      }
    }
  }

  const collectBtnHandler = async (book: RemoteBook) => {
    const text = await downloadBookAction(book)
    console.log(text)
    await syncBookAction(book, text)
  }

  useEffect(() => {
    isClientLoaded && fetchBooksListAction()
  }, [isClientLoaded])

  return (
    <>
      <button onClick={reloadBtnHandler}>reload</button>
      <div className="collection">
        {books.map((book: RemoteBook, index: number) => (
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
