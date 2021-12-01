const FRAME_UP = 1;
const FRAME_DOWN = 3;

/**
 * getRendersFrame
 * return pages in frame range for a page  
 * for frame up = 1 and frame down = 3
 * page = 2, pageCount = 10 => [1, 2, 3, 4]
**/ 
export const getRendersFrame = (page: number = 0, pageCount: number = page) => {
    const up = page - FRAME_UP > 0 ? page - FRAME_UP : 0
    const down = page + FRAME_DOWN < pageCount ? page + FRAME_DOWN : pageCount;

    return [up, page, down] 
}
