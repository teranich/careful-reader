import React, { useState, useEffect } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PDFReader from './PDFReader';
import { IBook } from 'src/types';
import text from '../../mocks/book.pdf';
import { PDFBookFormat } from '../../utils/formats/PDFBookFormat';

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
        info: {} as IBook,
        text,
    };

    return <PDFReader book={book} mode="greed"/>;
};

const Primary = Template.bind({});

Primary.args = {
    book: { info: {} as IBook, text: 'gita' },
};

const PDFFormat = () => {
    const pdf = new PDFBookFormat(text);
    const [Image, setImage] = useState<string>('#');

    useEffect(() => {
        pdf.getBookCover().then((canvasBase64) => {
            if (canvasBase64) setImage(canvasBase64);
        });
    }, []);
    return (
        <>
            <h1>pdf cover</h1>
            <img src={Image} />
        </>
    );
};

export { PDFFormat };
export { Primary };
