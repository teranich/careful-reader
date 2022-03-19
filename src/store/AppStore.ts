import { action, makeAutoObservable } from 'mobx';
import { createIntl, createIntlCache } from 'react-intl';

import en_messages from '../translations/locales/en.json';
import ru_messages from '../translations/locales/ru.json';
import * as cloud from '../utils/cloud';
import { RootStore } from './RootStore';

const DEFAULT_LOCALE = 'en';
export default class AppStore {
    rootStore: RootStore;
    messages: {
        [key: string]: any;
    };
    defaultLocale: string = DEFAULT_LOCALE;
    locale: string = DEFAULT_LOCALE;
    wordsHighlight: boolean = true;
    dynamicTextOrientation: boolean = false;
    pageColor: string = 'white';
    pageBackgroundColor: string = '#0000';
    isLoggedIn: boolean = false;
    isClientLoaded: boolean = false;
    isUseImageCover: boolean = true;
    imageCover: string = '1';

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
        const globalIntlCache = createIntlCache();

        createIntl({ locale: 'ru', messages: ru_messages }, globalIntlCache);
        createIntl({ locale: 'en', messages: en_messages }, globalIntlCache);

        this.defaultLocale = 'en';
        this.messages = {
            en: en_messages,
            ru: ru_messages,
        } as {
            [key: string]: any;
        };
    }

    async load() {
        try {
            await cloud.load();
            this.isClientLoaded = true;
            this.isLoggedIn = await cloud.isLoggedIn();
        } catch (e) {
            console.error(e);
        }
    }
    setLocale = action((locale: string) => {
        if (Object.keys(this.messages).includes(locale)) {
            this.locale = locale;
        } else {
            throw Error('Unsupported locale');
        }
    });

    setImageCoverAction = action((image: string) => (this.imageCover = image));

    getLocaleMessages = action(() => {
        const locale = this.locale;
        return this.messages[locale];
    });

    toggleHightligting = action((value: boolean) => {
        this.wordsHighlight = value;
    });

    toggleDynamicTextOrientation = action((value: boolean) => {
        this.dynamicTextOrientation = value;
    });

    setPageColor = action((value: string) => {
        this.pageColor = value;
    });

    toggleUseImageCover = action((value: boolean) => {
        this.isUseImageCover = value;
    });

    setPageBackgroundColorAction = action((value: string) => {
        this.pageBackgroundColor = value;
    });

    signInAction = action(async () => {
        await cloud.signIn();
        this.isLoggedIn = await cloud.isLoggedIn();
    });

    signOutAction = action(async () => {
        await cloud.signOut();
        this.isLoggedIn = await cloud.isLoggedIn();
    });
}
