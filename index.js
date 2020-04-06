import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

const homeContainer = document.getElementById('rootapp');

// Para SSR
hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  , homeContainer
);
