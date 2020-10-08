import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import LibraryStoreContext from '../../store/LibraryStore'
import { observer } from 'mobx-react'
import { Book } from '../../types'
import BookItem from '../../components/common/BookItem'
import BookShelfImage from './book-shelf.png'
// import './feed.scss'
import { Header } from '../../components/common'
import { useIntl } from 'react-intl'


export default observer(function Feed() {
  const intl = useIntl()
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
            <span className="title">{intl.formatMessage({ id: 'feed.to-read' })}</span>
            <BookItem book={meta} />
          </section>}
        <section className="link-to-shelves">
          <span className="title">{intl.formatMessage({ id: 'feed.library' })}</span>
          <Link to="/shelves" >
            <img src={BookShelfImage} alt="shelve" />
          </Link>
        </section>
      </div>
    </div>
  )
})

