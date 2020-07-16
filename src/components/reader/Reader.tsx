import React, { useEffect, useState, useRef, useContext } from 'react'
import './Reader.scss'
import { useParams, Link } from 'react-router-dom'
import { debounce } from '../../uitls/common'
import { hightLightElementsOnScreen } from '../../uitls/styler'
import { Checkbox } from '../controls/Checkbox'
import { DispatchContext, StateContext } from '../../App'
import { getBookText } from '../../uitls/database'
import { Book } from '../../types'

interface QueryParams {
  bookId: string
}

const dfunc = debounce((fn) => fn && fn(), 100)

export default function Reader() {
  const dispatch = useContext(DispatchContext)
  const state = useContext(StateContext)
  const [numberOfcurrentPage, setNumberOfCurrentPage] = useState(0)
  const [currenPositionPercent, setCurrenPositionPercent] = useState('0.0')
  const [pagesCount, setPagesCount] = useState(0)
  const [wordsHighlight, setWordsHighlight] = useState(true)
  const textContainerRef = useRef<HTMLDivElement | null>(null)
  let elementsForHightlight: any = []
  const queryParams = useParams<QueryParams>()
  const bookId = parseInt(queryParams.bookId)

  useEffect(() => {
    const { current } = textContainerRef
    getBookText(bookId).then((text) => {
      current!.innerHTML = text
      restoreScrollPoition()
      current!.addEventListener('scroll', handleScroll)
      setPagesCount(getPagesCount())
      elementsForHightlight = getElementsForHightlight()
    })

    return () => {
      return current!.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function getElementsForHightlight() {
    const result: any = []
    document.querySelectorAll('p').forEach((el: any) => {
      result.push(el)
    })
    return result.sort((a: any, b: any) => a.offsetTop > b.offsetTop)
  }

  function handleScroll(e: Event) {
    const { current } = textContainerRef
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
      (book: Book) => book.id == bookId
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

  const handlePageChange = (direction: string) => () => {
    const { current } = textContainerRef
    if (current) {
      const sign = direction === 'next' ? 1 : -1
      current.scrollTop += sign * current.clientHeight
    }
  }

  return (
    <div className={`reader list-view ${wordsHighlight ? 'highlight' : ''}`}>
      <div className="text-info">
        <Link className="home" to="/"></Link>
        <div>
          <Checkbox
            label="highlight"
            value={wordsHighlight}
            onChange={() => setWordsHighlight(!wordsHighlight)}
          />
        </div>
        {/* <div className="book-name">{currentBook?.name}</div> */}
        <div className="">{currenPositionPercent}%</div>
        <div className="pages">
          {numberOfcurrentPage} / {pagesCount}
        </div>
      </div>
      <div className="text-container" ref={textContainerRef}></div>
      <div className="prev-page" onClick={handlePageChange('prev')}></div>
      <div className="next-page" onClick={handlePageChange('next')}></div>
    </div>
  )
}
