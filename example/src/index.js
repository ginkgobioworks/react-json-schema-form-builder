import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';

import UiExtension from '@bloomreach/ui-extension';


const container = document.getElementById('root');
const root = createRoot(container);

const registerBloomreach = async function () {
    const BloomreachUi = await UiExtension.register();
    const brDocument = await BloomreachUi.document.get();
    const value = await BloomreachUi.document.field.getValue();
    return [value?value:'{}', BloomreachUi];
}
const returnvalue = registerBloomreach();

const callback = function (newvalue) {
    returnvalue[1].document.field.setValue(newvalue);
};

root.render(<App
    initalvalue={returnvalue[0]}
    bloomreachcallback={callback}
/>);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
