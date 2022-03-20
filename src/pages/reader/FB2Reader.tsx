import React, { useEffect, useState, useRef, useContext } from 'react';
// import './Reader.scss'
import { useParams } from 'react-router-dom';
import { debounce } from '../../utils/common';
import { hightLightElementsOnScreen } from '../../utils/styler';
import { observer } from 'mobx-react';
import useEventListener from '@use-it/event-listener';
import { Loading } from '../../components/loading';
import { useDebounce } from 'use-debounce';
import styled from 'styled-components';
import { RootStoreContext } from '../../store/RootStore';
import { TCurrentBook } from 'src/store/LibraryStore';
import { Hightlighter } from './Hightlighter';
import BackgroundImage from './page2.jpg';

const PageCount = styled.span`
    white-space: nowrap;
    padding: 6px 8px;
`;
interface QueryParams {
    bookId: string;
}

const TextContainer = styled.div`
    height: 100vh;
    overflow-x: hidden;
    width: 100vw;
    margin: 0 auto;
    font-size: calc(16px + 1vw);
    left: calc(2.8rem / 2);
    background-color: #d8b67d;
    .section {
        padding: 10px;
    }
    .text-wrapper {
        background-image: url(${BackgroundImage});
        background-size: contain;
        opacity: 0.9;
        padding: 0 16px;
    }
    .text-cover .image-wrapper {
        text-align: center;
        img {
            height: 90vmin;
        }
    }
`;
const dfunc = debounce((fn) => fn && fn(), 100);

export default observer(function Reader() {
    const { appStore, libraryStore } = useContext(RootStoreContext);
    const { wordsHighlight, dynamicTextOrientation } = appStore;
    const { updateBookPositionAction, openBookAction, lastBook } =
        libraryStore;
    const currentBookRef = useRef<TCurrentBook>(lastBook);
    const [numberOfcurrentPage, setNumberOfCurrentPage] = useState(0);
    const [currenPositionPercent, setCurrenPositionPercent] = useState('0.0');
    const [pagesCount, setPagesCount] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const textContainerRef = useRef<HTMLDivElement | null>(null);
    const elementsForHightlightRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const queryParams = useParams<QueryParams>();
    const bookId = parseInt(queryParams.bookId);
    const [motionStyle, setMotionStyle] = useState({});

    useEffect(() => {
        const { current } = textContainerRef;
        const openBook = async () => {
            setLoading(true);
            const openedBook = await openBookAction(bookId);
            currentBookRef.current = openedBook;
            openedBook && (current!.innerHTML = openedBook.text);
            elementsForHightlightRef.current = getElementsForHightlight();
            setPagesCount(getPagesCount());
            const positions: any[] = [];
            current
                ?.querySelectorAll('p')
                .forEach((o: HTMLElement) =>
                    positions.push(o.getAttribute('data-id')),
                );
            openedBook &&
                restoreScrollPoition(openedBook.info.positionElement);
            setLoading(false);
        };
        openBook();
        current!.addEventListener('scroll', handleScroll);
        return () => {
            return current!.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const [dtoStyle] = useDebounce(motionStyle, 5);
    const deviceOrientationHandler = ({ gamma }: DeviceOrientationEvent) => {
        if (!dynamicTextOrientation) {
            setMotionStyle({ transform: '' });
            return;
        }
        if (gamma) {
            const style = {
                transform: `rotateZ(${-gamma}deg)`,
            };
            setMotionStyle(style);
        }
    };
    const bookTitle = () =>
        currentBookRef.current?.info?.meta?.title ||
        currentBookRef.current?.info?.name;
    useEventListener('deviceorientation', deviceOrientationHandler);
    return (
        <>
            {/* <Header className={`${showControls ? '' : ' hidden'} `} title={bookTitle()}>
                <div>{currenPositionPercent}%</div>
                <PageCount>{`${numberOfcurrentPage}/${pagesCount}`}</PageCount>
            </Header> */}
            <Loading loading={loading}>
                <Hightlighter wordsHighlight={wordsHighlight}>
                    <TextContainer
                        onClick={toggleMenuHandler}
                        style={dtoStyle}
                        ref={textContainerRef}
                    />
                </Hightlighter>
            </Loading>
        </>
    );

    function getElementsForHightlight() {
        const result: any = [];
        document.querySelectorAll('p').forEach((el: any) => {
            result.push(el);
        });
        return result.sort((a: any, b: any) => a.offsetTop > b.offsetTop);
    }

    function handleScroll(e: Event) {
        const { current } = textContainerRef;
        const { current: elementsForHightlight } = elementsForHightlightRef;
        if (current) {
            const percent = getPercentOfScroll();
            setCurrenPositionPercent(percent.toFixed(2));
            setNumberOfCurrentPage(getNumberOfCurrentPage());
            dfunc(() => {
                const onScreen =
                    hightLightElementsOnScreen(
                        current,
                        elementsForHightlight,
                    ) || [];
                updateBookPosition(onScreen[0]);
            });
        }
    }

    function getPercentOfScroll() {
        const { current } = textContainerRef;
        return current
            ? (current.scrollTop * 100) / current.scrollHeight
            : 0.0;
    }

    function updateBookPosition(posElement: HTMLElement) {
        if (posElement) {
            const positionElementId = posElement.getAttribute('data-id');
            const book = currentBookRef.current?.info;
            book &&
                positionElementId &&
                updateBookPositionAction(book, positionElementId);
        }
    }

    function restoreScrollPoition(positionId: string) {
        if (positionId) {
            const toElement = document.querySelector(
                `[data-id="${positionId}"]`,
            );
            toElement?.scrollIntoView();
        }
    }

    function getPagesCount() {
        const { current } = textContainerRef;
        return Math.round(current!.scrollHeight / current!.clientHeight);
    }

    function getNumberOfCurrentPage() {
        const { current } = textContainerRef;
        return Math.round(current!.scrollTop / current!.clientHeight);
    }

    function toggleMenuHandler() {
        setShowControls(!showControls);
    }
});
