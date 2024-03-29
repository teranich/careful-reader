import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'normalize.css';

const app = <App />;

ReactDOM.render(app, document.getElementById('root'));

if ('serviceWorker' in navigator) {
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker
    //         .register('/sw.js')
    //         .then((registration) => {
    //             console.log('SW registered: ', registration);
    //         })
    //         .catch((registrationError) => {
    //             console.log('SW registration failed: ', registrationError);
    //         });
    // });
    // navigator.serviceWorker.ready.then(registration => {
    //     registration.unregister().then(() => {
    //         window.location.reload();
    //     });
    // });
}
