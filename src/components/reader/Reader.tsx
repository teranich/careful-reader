import React, { useEffect, useState } from 'react'
import './Reader.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getBookText, updateBookPosition } from '../../store/actions'
import { MainState } from '../../types'
import { useParams, Link } from 'react-router-dom'
import { debounce } from '../../uitls/common'

interface QueryParams {
    bookId: string
}
const dfunc = debounce((fn) => fn && fn(), 500)

export default function Reader() {
    const dispatch = useDispatch()
    const [pagesCount, setPagesCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const queryParams = useParams<QueryParams>()
    const bookId = parseInt(queryParams.bookId)

    const bookText = useSelector((state: MainState) => {
        return state.shelf.bookText
    })
    const currentBook = useSelector((state: MainState) => {
        return state.shelf.books.find((book) => book.id === bookId)
    })

    useEffect(() => {
        dispatch(getBookText(bookId))
    }, [bookId])

    useEffect(() => {
        setPagesCount(getPagesCount())
        if (currentBook && currentBook.page !== currentPage) {
            scrollToPage(currentBook.page)
        }
    }, [bookText, currentBook])

    useEffect(() => {
        container().addEventListener('scroll', handleScroll)
        return () => {
            container().removeEventListener('scroll', handleScroll)
        }
    })

    function handleScroll(e: Event) {
        const pageWidth = getPageWidth()
        const nextPage = Math.round((container().scrollLeft + pageWidth) / pageWidth)

        if (nextPage !== currentPage) {
            setCurrentPage(nextPage)
            dfunc(dispatch(updateBookPosition(bookId, nextPage)))
        }
    }

    function handleWheel(e: any) {
        // container().scrollLeft += e.deltaY
        const sign = e.deltaY > 0 || e.deltaX > 0 ? 1 : -1
        const nextPage = currentPage + sign
        scrollToPage(nextPage)
    }

    function scrollToPage(page: number) {
        if (currentPage !== page) {
            const pageWidth = getPageWidth()
            container().scrollLeft = page * pageWidth - pageWidth
        }
    }

    function getPagesCount() {
        const limit = container().scrollWidth
        const pageWidth = getPageWidth()
        return Math.ceil(limit / pageWidth)
    }

    function container() {
        return document.getElementById('book-container') || document.body
    }

    function getPageWidth() {
        const book = document.querySelector('.book')
        const containerElement = container()

        let gapOffset = 0
        if (book) {
            const bookCS = window.getComputedStyle(book)
            gapOffset = parseInt(bookCS.columnGap) / 2
        }
        return containerElement.clientWidth + gapOffset
    }

    const handlePageChange = (direction: string) => (e: React.MouseEvent) => {
        const nextPage = direction === 'next' ? currentPage + 1 : currentPage - 1
        scrollToPage(nextPage)
    }

    return (
        <div className="reader">
            <div className="book-info">
                <Link to="/"><div className="home"></div></Link>
                <div className="book-name">{currentBook?.name}</div>
                <div className="pages">{currentPage} / {pagesCount}</div>
            </div>
            <div id="book-container"
                dangerouslySetInnerHTML={{ __html: bookText }}
                onWheel={handleWheel}
            >
            </div>

            <div className="prev-page" onClick={handlePageChange('prev')}></div>
            <div className="next-page" onClick={handlePageChange('next')}></div>
        </div>
    )
}
