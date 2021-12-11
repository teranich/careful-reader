import { uniq } from 'lodash';

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
    const up = page - FRAME_UP > 0 ? page - FRAME_UP : 0;
    const down = page + FRAME_DOWN < pageCount ? page + FRAME_DOWN : pageCount;

    return [up, page, down];
};

export const usePagesManager = (pages = [], pageCount = 0) => {
    const goToPage = (page) => {
        const frame = getRendersFrame(page, pageCount);
        result.pages = uniq([...result.pages, ...frame].sort());
        console.log(result.pages)
    };
    const result = {pages, goToPage};

    return result;
};
