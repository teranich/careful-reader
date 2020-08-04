import React, { useEffect, useState, useRef, useContext } from 'react'
import './Reader.scss'
import { useParams, Link } from 'react-router-dom'
import { debounce } from '../../uitls/common'
import { hightLightElementsOnScreen } from '../../uitls/styler'
import { Checkbox } from '../common'
import { DispatchContext, StateContext } from '../../App'
import { getBookText } from '../../uitls/clientDB'
import { Book, BookList } from '../../types'
import HomeIcon from './home.svg'

interface QueryParams {
  bookId: string
}
interface ReaderProps {
  books: BookList
}

const dfunc = debounce((fn) => fn && fn(), 100)

export default function Reader({ books }: ReaderProps) {
  const dispatch = useContext(DispatchContext)
  const state = useContext(StateContext)
  const [numberOfcurrentPage, setNumberOfCurrentPage] = useState(0)
  const [currenPositionPercent, setCurrenPositionPercent] = useState('0.0')
  const [pagesCount, setPagesCount] = useState(0)
  const [wordsHighlight, setWordsHighlight] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const textContainerRef = useRef<HTMLDivElement | null>(null)
  const elementsForHightlightRef = useRef([])

  const queryParams = useParams<QueryParams>()
  const bookId = parseInt(queryParams.bookId)

  const handlePageChange = (direction: string) => () => {
    const { current } = textContainerRef
    if (current) {
      const sign = direction === 'next' ? 1 : -1
      current.scrollTop += sign * current.clientHeight
    }
  }

  /*eslint-disable */
  useEffect(() => {
    const { current } = textContainerRef
    if (!books.length) return
    getBookText(bookId).then((text) => {
      current!.innerHTML = text
      setPagesCount(getPagesCount())
      restoreScrollPoition()
      elementsForHightlightRef.current = getElementsForHightlight()
      current!.addEventListener('scroll', handleScroll)
    })

    return () => {
      return current!.removeEventListener('scroll', handleScroll)
    }
  }, [books.length])
  /*eslint-enable */

  return (
    <div className={`reader list-view ${wordsHighlight ? 'highlight' : ''}`}>
      <div className={`text-info${showControls ? '' : ' hidden'}`}>
        <div>
          <Checkbox
            label="highlight"
            value={wordsHighlight}
            onChange={toggleHightligting}
          />
        </div>
        <div className="">{currenPositionPercent}%</div>
        <div className="pages">
          {numberOfcurrentPage} / {pagesCount}
        </div>
        <Link className="home" to="/">
          <img src={HomeIcon} alt="" />
        </Link>
      </div>

      <div
        className="text-container"
        onClick={toggleMenuHandler}
        ref={textContainerRef}
      ></div>
      <div className="prev-page" onClick={handlePageChange('prev')}></div>
      <div className="next-page" onClick={handlePageChange('next')}></div>
    </div>
  )

  function getElementsForHightlight() {
    const result: any = []
    document.querySelectorAll('p').forEach((el: any) => {
      result.push(el)
    })
    return result.sort((a: any, b: any) => a.offsetTop > b.offsetTop)
  }

  function handleScroll(e: Event) {
    const { current } = textContainerRef
    const { current: elementsForHightlight } = elementsForHightlightRef
    if (current) {
      const percent = getPercentOfScroll()
      setCurrenPositionPercent(percent.toFixed(2))
      setNumberOfCurrentPage(getNumberOfCurrentPage())
      dfunc(() => {
        const onScreen =
          hightLightElementsOnScreen(current, elementsForHightlight) || []
        updateBookPosition(onScreen[0])
      })
    }
  }

  function restoreScrollPoition() {
    const currentBook: Book | undefined = state.find(
      (book: Book) => book.id === bookId
    )
    if (currentBook) {
      const toElement = document.querySelector(
        `[data-id="${currentBook.positionElement}"]`
      )
      toElement?.scrollIntoView()
    }
  }

  function getPercentOfScroll() {
    const { current } = textContainerRef
    return current ? (current.scrollTop * 100) / current.scrollHeight : 0.0
  }

  function updateBookPosition(posElement: HTMLElement) {
    if (posElement) {
      const positionElement = posElement.getAttribute('data-id')
      const payload = { bookId, positionElement }
      dispatch({ type: 'update_book_position', payload })
    }
  }

  function getPagesCount() {
    const { current } = textContainerRef
    return Math.round(current!.scrollHeight / current!.clientHeight)
  }

  function getNumberOfCurrentPage() {
    const { current } = textContainerRef
    return Math.round(current!.scrollTop / current!.clientHeight)
  }

  function toggleHightligting() {
    setWordsHighlight(!wordsHighlight)
  }

  function toggleMenuHandler() {
    setShowControls(!showControls)
  }
}
