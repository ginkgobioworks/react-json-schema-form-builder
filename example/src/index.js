import React from 'react';
import {render} from 'react-dom';

import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';

import UiExtension from '@bloomreach/ui-extension';


const container = document.getElementById('root');
const root = createRoot(container);

// // const registerBloomreachAndRender = async function () {
//     // const BloomreachUi = await UiExtension.register();
//     // const brDocument = await BloomreachUi.document.get();
//     // const value = await BloomreachUi.document.field.getValue();
//     // console.log('value: ' + value);
//     // console.log('BLoomreachui: ' + BloomreachUi);

//     // const callback = function (newvalue) {
//     //     returnvalue[1].document.field.setValue(newvalue);
//     // };
    
//     // return [value?value:'{}', BloomreachUi];
// // }
// // const returnvalue = registerBloomreachAndRender();
// root.render(<App
//     // initalvalue={value?value:'{}'}
//     // bloomreachcallback={callback}
// />);

// returnvalue[0].then(

// )

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const ui = await UiExtension.register();
        root.render(
            <App mode={'openUi'} ui={ui}/>
        );

    } catch (error) {
        console.log(error);
        console.error('Failed to register extension:', error.message);
        console.error('- error code:', error.code);
        root.render(
            <App mode={'openUi'}/>
        );
    }
});
