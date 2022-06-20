import styled from 'styled-components';

let classes = ``;
for (let i = 0; i < 100; i++) {
    const tone = i * 1.6;
    classes += `.w${i} {
    color: rgb(${tone},${tone},${tone});
    }
    `;
}

export interface IHightlighter {
    readonly wordsHighlight: boolean;
}

export const Hightlighter = styled.div<IHightlighter>`
    .page canvas,
    .page svg {
        opacity: ${(props) => (props.wordsHighlight ? '0.1' : '1')};
    }
    ${(props) => props.wordsHighlight && classes}
`;


