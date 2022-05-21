import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Outline } from 'react-pdf/dist/esm/entry.webpack';
import { getCurrentHeaderHeight } from '../../../components/common/Header';
import styled from 'styled-components';

const OutlineIS = styled(Outline)`
    position: fixed;
    z-index: 2000;
    background-color: white;
    width: 100vw;
    overflow: auto;
    bottom: 0;
    top: ${getCurrentHeaderHeight()}px;
    padding: 10px;
    display: none;
    li a:hover {
        color: red;
    }
`;

export const OutlineMenu = forwardRef(({ onItemClick }, ref) => {
    const tableOfContentsRef = useRef(false);

    const hideTableOfCpntents = () => {
        tableOfContentsRef.current.setAttribute('style', 'display:none;');
    };
    const showTableOfCpntents = () => {
        tableOfContentsRef.current.setAttribute('style', 'display:block;');
    };
    const toggleTableOfContents = () => {
        const { current } = tableOfContentsRef;
        const lastState = current.getAttribute('style') || 'display:none;';

        const actualState = lastState.includes('display:none')
            ? 'display:block;'
            : 'display:none;';
        current.setAttribute('style', actualState);
    };

    useImperativeHandle(ref, () => ({
        hideTableOfCpntents,
        showTableOfCpntents,
        toggleTableOfContents,
    }));

    return (
        <OutlineIS
            inputRef={tableOfContentsRef}
            onItemClick={({ pageIndex, pageNumber }) => {
                hideTableOfCpntents();
                return onItemClick({ pageIndex, pageNumber });
            }}
        />
    );
});
