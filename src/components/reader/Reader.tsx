import React, { useEffect, useState, useRef, useContext } from 'react'
import './Reader.scss'
import { useParams } from 'react-router-dom'
import { debounce } from '../../uitls/common'
import { hightLightElementsOnScreen } from '../../uitls/styler'
import { Checkbox, Header } from '../common'
import LibraryStoreContext from '../../store/LibraryStore'
import { observer } from 'mobx-react'
import useEventListener from '@use-it/event-listener'

interface QueryParams {
  bookId: string
}

const dfunc = debounce((fn) => fn && fn(), 100)

export default observer(function Reader() {
  const { updateBookPositionAction, openBookAction, currentBook } = useContext(
    LibraryStoreContext
  )
  const [numberOfcurrentPage, setNumberOfCurrentPage] = useState(0)
  const [currenPositionPercent, setCurrenPositionPercent] = useState('0.0')
  const [pagesCount, setPagesCount] = useState(0)
  const [wordsHighlight, setWordsHighlight] = useState(true)
  const [dynamicTextOrientation, setDynamicTextOrientation] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const textContainerRef = useRef<HTMLDivElement | null>(null)
  const elementsForHightlightRef = useRef([])

  const queryParams = useParams<QueryParams>()
  const bookId = parseInt(queryParams.bookId)

  const [motionStyle, setMotionStyle] = useState({})

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

  useEventListener('deviceorientation', ({ gamma }: DeviceOrientationEvent) => {
    if (!dynamicTextOrientation) {
      setMotionStyle({ transform: '' });
      return;
    }
    if (gamma) {
      const style = {
        transform: `rotateZ(${- gamma}deg)`,
      };
      setMotionStyle(style);
    }
  })
  return (
    <div className="reader">
      <Header className={`${showControls ? '' : ' hidden'} p-fixed z-max`}>
        <div>
          <Checkbox
            label="highlight"
            value={wordsHighlight}
            onChange={toggleHightligting}
          />
          <Checkbox
            label="dto"
            value={dynamicTextOrientation}
            onChange={toggleDynamicTextOrientation}
          />
        </div>
        <div className="">{currenPositionPercent}%</div>
        <div className="pages">
          {numberOfcurrentPage} / {pagesCount}
        </div>
      </Header>
      <div className={`list-view ${wordsHighlight ? 'highlight' : ''}`}>
        <div
          className="text-container"
          onClick={toggleMenuHandler}
          style={motionStyle}
          ref={textContainerRef}
        ></div>
        {/* <div className="prev-page" onClick={handlePageChange('prev')}></div> */}
        {/* <div className="next-page" onClick={handlePageChange('next')}></div> */}
      </div>
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

  function toggleDynamicTextOrientation() {
    setDynamicTextOrientation(!dynamicTextOrientation)
  }


})
