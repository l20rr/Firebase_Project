import React from 'react';
import ReactDOM from 'react-dom/client';

import Routers from './routes';
import { BrowserRouter as Router } from "react-router-dom";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <Router>
      <Routers />
    </Router>
  </React.StrictMode>
);

