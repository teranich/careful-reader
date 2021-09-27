module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
    core: {
        builder: 'webpack5',
    },
    webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.pdf$/,
      use: [
      {
        loader: 'raw-loader',
      }
    ]
    });

    // Return the altered config
    return config;
  },
};
