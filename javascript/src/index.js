import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {AppProviders} from "./Context/provider";
import './components/Common/i18n';

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
      <AppProviders>
        <App/>
      </AppProviders>
  </React.StrictMode>
)