import React from 'react';
import { render } from 'react-dom';

import OptionsLayout from './Layout/options';

// css.global('input::-moz-focus-inner,input::-moz-focus-outer { border: 0; }');

render(<OptionsLayout />, document.getElementById('options-app'));
