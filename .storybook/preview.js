import { RootStoreContext, RootStore } from '../src/store/RootStore';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
const rootStore = new RootStore();
export const decorators = [
    (Story) => (
        <RootStoreContext.Provider value={rootStore}>
            <Story />
        </RootStoreContext.Provider>
    ),
];
