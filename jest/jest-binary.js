const fs = require('fs')

const path = require('path');

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/tutorial-webpack.html

function process(sourceText, filename, config, options) {
    // console.warn('wtf', sourceText, sourcePath, transformOptions);
    // return 'wtf';
    // for (var i = 0; i != sourceText.length; ++i) {
    //     array[i] = String.fromCharCode(sourceText[i]);
    // }
    const filePath = path.resolve(__dirname, filename)
    console.log('path', filePath, filename)
    const data =  new Uint8Array(fs.readFileSync(filePath))
    console.log(data)
    return  `
    module.exports = ${data};`;
}

module.exports = {process
};

module.exports.raw = true;
const source = 'text'
const filename = '../src/mocks/book.pdf'
process(source, filename)