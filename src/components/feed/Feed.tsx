import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import LibraryStoreContext from '../../store/LibraryStore'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import BookItem from '../common/BookItem'
import BookShelfImage from './book-shelf.png'
import './feed.scss'
import { Header } from '../common'

export default observer(function Feed() {
  const { currentBook } = useContext(
    LibraryStoreContext
  )
  const { meta }: { meta: Book } = currentBook

  return (
    <div className="feed">
      <Header></Header>
      <div className="content">
        {meta.id &&
          <section className="current-book">
            <span className="title">to read...</span>
            <BookItem book={meta} to={`/read/${meta.id}`} />
          </section>}
        <section className="link-to-shelves">
          <span className="title">Library</span>
          <Link to="/shelves" >
            <img src={BookShelfImage} alt="shelve" />
          </Link>
        </section>
      </div>
    </div>
  )
})
