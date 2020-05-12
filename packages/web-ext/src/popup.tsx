import React from 'react';
import { render } from 'react-dom';

import PopupLayout from './Layout/popup';
import { initState } from './store/lib/init';

// css.global('button::-moz-focus-inner,button::-moz-focus-outer { border: 0; }');
// css.global('input::-moz-focus-inner,input::-moz-focus-outer { border: 0; }');

initState();

render(<PopupLayout />, document.getElementById('popup-app'));
