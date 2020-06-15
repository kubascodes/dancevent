"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import * as serviceWorker from './serviceWorker';
serviceWorker.unregister();
//import WebFontLoader from 'webfontloader';
//import 'react-md/dist/react-md.indigo-pink.min.css'

import 'bootstrap/dist/css/bootstrap.min.css';

/*
WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
    },
});
*/


ReactDOM.render(<App />, document.getElementById('app'));
