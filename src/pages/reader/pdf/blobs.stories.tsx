import React, { useRef, useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import PDFReader from './PDFReader';
import styled from 'styled-components';
import { readFileContent } from '../../utils/common';


const TextArea = styled.textarea`
    width: 500px;
    height: 250px;
    display: block;
`;

const BlobFromText = () => {
    const textToBlob = (text) => {
        const blob = new Blob([text], {
            type: 'text/plain;charset=utf-8',
        });
        return URL.createObjectURL(blob);
    };

    const [text, setText] = useState(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    );
    const [blobURI, setBlobURI] = useState(textToBlob(text));

    const handleChange = (event) => {
        event.preventDefault();
        setText(event.target.value);
        const blob = textToBlob(event.target.value);
        URL.revokeObjectURL(blobURI);
        setBlobURI(blob);
    };

    return (
        <>
            <TextArea value={text} onChange={handleChange}></TextArea>
            <div>
                <a href={blobURI} download={blobURI} target="_blank">
                    {blobURI}
                </a>
            </div>
        </>
    );
};
const PageContainerIS = styled.div`
    position: relative;
`;
const BlobFile = () => {
    const [book, setBook] = useState();
    const fileInput = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        const cuurentFile = fileInput.current.files[0];
        // setFile(cuurentFile)
        readFileContent(cuurentFile).then((text) => {
            setBook({
                text,
            });
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Upload file:
                    <input type="file" ref={fileInput} accept=".pdf,.pdff" />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>

            <PageContainerIS>
                <PDFReader book={book} />
            </PageContainerIS>
        </div>
    );
};

export default {
    title: 'BLOB story',
    component: BlobFromText,
} as ComponentMeta<typeof PDFReader>;

export { BlobFromText, BlobFile };
