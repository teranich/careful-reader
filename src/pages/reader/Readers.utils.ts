import { uniq } from 'lodash';
import { useState } from 'react';

const FRAME_UP = 1;
const FRAME_DOWN = 3;

/**
 * getRendersFrame
 * return pages in frame range for a page
 * for frame up = 1 and frame down = 3
 * page = 2, pageCount = 10 => [1, 2, 3, 4]
 **/
export const getRendersFrame = (
    page: number = 0,
    pageCount: number = page,
) => {
    const up = page - FRAME_UP > 0 ? page - FRAME_UP : 1;
    const down = page + FRAME_DOWN < pageCount ? page + FRAME_DOWN : pageCount;

    return Array(down - up + 1)
        .fill('0')
        .map((_, i) => up + i);
};

export const usePagesManager = (
    initialPages: number[] = [],
    pageCount = 0,
) => {
    const [pages, setPages] = useState(initialPages);

    const goToPage = (page: number) => {
        const frame = getRendersFrame(page, pageCount);
        const newPages = uniq([...pages, ...frame]).sort(
            (a: number, b: number) => {
                if (a > b) return 1;
                if (a < b) return -1;
                return 0;
            },
        );

        pages.splice(0, pages.length, ...newPages);
        setPages(newPages);
    };

    const next = () => {
        const nextFramePageNumber = pages[pages.length - 1] + 1;
        if (nextFramePageNumber === pageCount) return;

        goToPage(nextFramePageNumber);
    };

    const prev = () => {
        const prevFramePageNumber = pages[0] - 1;
        if (!prevFramePageNumber) return;

        goToPage(prevFramePageNumber);
    };

    return { pages, goToPage, prev, next };
};