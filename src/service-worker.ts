import { precacheAndRoute } from 'workbox-precaching';

// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', function (event) {
    console.log('installed');
});
