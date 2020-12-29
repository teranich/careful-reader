const {
    override,
    addWebpackAlias,
} = require('customize-cra');
const path = require('path');

module.exports = override(
    addWebpackAlias({
        ['theme']: path.resolve(__dirname, 'src/theme.ts')
    })
);