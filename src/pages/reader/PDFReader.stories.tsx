import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import PDFReader from './PDFReader';
import { Book } from 'src/types';

export default {
    title: 'PDF reader',
    component: PDFReader,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof PDFReader>;

const Template: ComponentStory<typeof PDFReader> = (args) => <PDFReader {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    book: { info: {} as Book, text: 'string' },
};
