import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

const homeContainer = document.getElementById('rootapp');

// Para SSR
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  , homeContainer
);
