import React, { useEffect } from 'react';
import './App.scss';
import Shelves from './pages/shelves';
import Reader from './pages/reader';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import { RootStoreContext, RootStore } from './store/RootStore';
import { IntlProvider } from 'react-intl';
import { Settings } from './pages/settings';
import Notifications from './components/Notifications';

const rootStore = new RootStore();
const App = observer(function App() {
    const { appStore, libraryStore, remoteLibraryStore } = rootStore;
    const { isLoggedIn } = remoteLibraryStore;
    const messages = appStore.getLocaleMessages();

    useEffect(async () => {
        await rootStore.load()
        await Promise.all([appStore.load(), remoteLibraryStore.load()])
        libraryStore.fetchBooksListAction();
    }, []);

    const fetchBooks = async () => {
        isLoggedIn && await remoteLibraryStore.fetchBooksListAction();
    };
    useEffect(() => {
        fetchBooks();
    }, [isLoggedIn]);

    return (
        <RootStoreContext.Provider value={rootStore}>
            <IntlProvider
                locale={appStore.locale}
                defaultLocale={appStore.defaultLocale}
                messages={messages}
            >
                <BrowserRouter basename="">
                    <Routes>
                        <Route path="/" element={<Shelves />} />
                        <Route path="/read/:bookId" element={<Reader />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </BrowserRouter>
                <Notifications />
            </IntlProvider>
        </RootStoreContext.Provider>
    );
});

export default App;
