module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
    core: {
        builder: 'webpack5',
    },
    webpackFinal: async (config, { configType }) => {
        config.module.rules.forEach((rule) => {
            if (rule.type === 'asset/resource') {
                rule.test = /\.(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)$/;
            }
        });

        config.module.rules.push({
            test: /\.pdf$/,
            use: 'binary-loader',
        });

        return config;
    },
};
