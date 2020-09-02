import React, { useEffect, useState, useRef, useContext } from 'react'
import './Reader.scss'
import { useParams, Link } from 'react-router-dom'
import { debounce } from '../../uitls/common'
import { hightLightElementsOnScreen } from '../../uitls/styler'
import { Checkbox } from '../common'
import HomeIcon from './home.svg'
import LibraryStoreContext from '../../store/LibraryStore'
import { observer } from 'mobx-react'

interface QueryParams {
  bookId: string
}

const dfunc = debounce((fn) => fn && fn(), 100)

export default observer(function Reader() {
  // @ts-ignore
  const { updateBookPositionAction, openBookAction, currentBook } = useContext(
    LibraryStoreContext
  )
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

  useEffect(() => {
    const { current } = textContainerRef
    const openBook = async () => {
      await openBookAction(bookId)
      current!.innerHTML = currentBook.text
      elementsForHightlightRef.current = getElementsForHightlight()
      setPagesCount(getPagesCount())
      restoreScrollPoition()
    }
    openBook()
    current!.addEventListener('scroll', handleScroll)
    return () => {
      return current!.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
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
        {/* <div className="prev-page" onClick={handlePageChange('prev')}></div> */}
        {/* <div className="next-page" onClick={handlePageChange('next')}></div> */}
      </div>
    </>
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
    if (currentBook.meta) {
      const toElement = document.querySelector(
        `[data-id="${currentBook.meta.positionElement}"]`
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
      updateBookPositionAction(bookId, positionElement)
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
})
