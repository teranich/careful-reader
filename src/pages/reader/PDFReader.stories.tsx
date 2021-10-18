import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PDFReader from './PDFReader';
import { Book } from 'src/types';
import text from '../../mocks/book.pdf';
console.log(text)
export default {
    title: 'PDF reader',
    component: PDFReader,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof PDFReader>;
const Template: ComponentStory<typeof PDFReader> = (args) => {
    // const [file, setFile] = useState('./gita.pdff');
    const book = {
        info: {} as Book,
        text,
    };

    return <PDFReader book={book} />;
};

const Primary = Template.bind({});
Primary.args = {
    book: { info: {} as Book, text: 'gita' },
};

export { Primary };
