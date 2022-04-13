import React from 'react';
import { SessionProvider } from './contexts/session';
import get from 'lodash/get';
import Home from './pages/home';

export default function App() {
  return (
    <SessionProvider serviceHost={get(window, 'blocklet.prefix', '/')}>
      <div className="app">
        <Home />
      </div>
    </SessionProvider>
  );
}
