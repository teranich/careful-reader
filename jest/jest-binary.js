const fs = require('fs')

const path = require('path');


function process(sourceText, filename, config, options) {
    const filePath = path.resolve(__dirname, filename)
    const data =  new Uint8Array(fs.readFileSync(filePath))
    return  `
    module.exports = ${data};`;
}

module.exports = {process
};

module.exports.raw = true;
// const source = 'text'
// const filename = '../src/mocks/book.pdf'
// process(source, filename)
