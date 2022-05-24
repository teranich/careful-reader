import { initial, uniq } from 'lodash';
import { useRef, useState } from 'react';

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

const prepare = (mess: number[]) =>
    uniq(mess).sort((a: number, b: number) => {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    });

export const usePagesManager = (
    initialPages: number[] = [],
    pageCount = 0,
) => {
    const page = initialPages.length ? initialPages[0] : 1;
    const withFrame = getRendersFrame(page, pageCount);

    const pages = useRef(prepare([...initialPages, ...withFrame]));

    const goToPage = (page: number) => {
        const frame = getRendersFrame(page, pageCount);
        pages.current = prepare([...pages.current, ...frame]).filter(
            (p) => !!p,
        );
    };

    const next = () => {
        const nextFramePageNumber =
            pages.current[pages.current.length - 1] + 1;
        if (nextFramePageNumber === pageCount) return;

        goToPage(nextFramePageNumber);
    };

    const prev = () => {
        const prevFramePageNumber = pages.current[0] - 1;
        if (!prevFramePageNumber) return;

        goToPage(prevFramePageNumber);
    };

    return { pages: () => pages.current, goToPage, prev, next };
};

export function useSingle<T>(initialValue: T): [() => T, (value: T) => T] {
    const ref = useRef(initialValue);
    const getValue = () => ref.current;
    const setValue = (value: T) => (ref.current = value);

    return [getValue, setValue];
}
