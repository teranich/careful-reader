const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const port = process.env.PORT || 1987;
const paths = {
    public: path.resolve(__dirname, '../public'),
    src: path.resolve(__dirname, '../src'),
    build: path.resolve(__dirname, '../build'),
    sw: path.resolve(__dirname, '../src/service-worker.ts'),
};
const { isDevBuild, devOnly, prodOnly, removeEmpty, getClientEnvironment } = require('./utils');
const env = getClientEnvironment(paths.public.slice(0, -1));
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    target: isDevBuild() ? 'web' : 'browserslist',
    mode: isDevBuild() ? 'development' : 'production',
    bail: !isDevBuild(), // Don't attempt to continue if there are any errors.
    devServer: devOnly({
        hot: true,
        open: false,
        port,
        static: {
            directory: paths.public
        },
        // disableHostCheck: true,
        historyApiFallback: true,
        compress: true,
        // stats: devOnly({
        //     colors: true,
        //     chunks: false,
        //     hash: false,
        //     version: false,
        //     timings: true,
        //     assets: false,
        //     children: false,
        //     source: false,
        //     warnings: true,
        //     noInfo: true,
        //     hot: true,
        //     modules: false,
        //     errors: true,
        //     reasons: true,
        //     errorDetails: true,
        //     entrypoints: false,
        // }),
    }),
    // devtool: 'source-map', // 'eval-cheap-module-source-map',
    devtool: 'inline-source-map',
    entry: `${paths.src}/index.tsx`,
    output: {
        path: paths.build,
        publicPath: '/',
        filename: '[name].bundle.js',
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: (info) =>
            path.relative(paths.src, info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    resolve: {
        modules: [paths.src, 'node_modules'],
        extensions: ['.web.ts', '.ts', '.web.tsx', '.tsx', '.web.js', '.js', '.json', '.web.jsx', '.jsx'],
        alias: {
            theme: `${paths.src}/theme.ts`,
        },
    },
    module: {
        rules: removeEmpty([
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
            {
                test: [/\.ts$/, /\.tsx$/],
                include: paths.src,
                loader: require.resolve('ts-loader'),
                options: {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: removeEmpty([devOnly(ReactRefreshTypeScript())]),
                    }),
                },
            },
        ]),
    },
    // experiments: {
    //     asset: true,
    // },
    plugins: removeEmpty([
        new webpack.DefinePlugin(env.stringified),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(`${paths.src}`, './index.html'),
            minimizer: prodOnly(
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        keep_classnames: true,
                        keep_fnames: true,
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                }),
            ),
        }),

        prodOnly(new InjectManifest({
            swSrc: paths.sw,
            swDest: 'sw.js',
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        })),
        new WebpackManifestPlugin({
            fileName: '../public/manifest.json',
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'node_modules/pdfjs-dist/cmaps/', to: 'cmaps/' }],
        }),
        devOnly(new ReactRefreshPlugin({ overlay: false })),
        devOnly({
            apply: (compiler) => {
                compiler.hooks.afterCompile.tap('CarefulReader', () =>
                    process.stdout.write(`\x1B[2J\x1B[3J\x1B[H\n🧐Careful Reader📖\t on: http://localhost:${port}\n`),
                );
            },
        }),
        // devOnly(
        //     new ESLintPlugin({
        //         extensions: ['ts', 'tsx'],
        //         failOnError: false,
        //         failOnWarning: false,
        //         lintDirtyModulesOnly: true,
        //     }),
        // ),
    ]),
    performance: devOnly({
        hints: false,
    }),
};
