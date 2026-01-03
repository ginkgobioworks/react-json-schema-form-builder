import React from 'react';
import ReactDOM from 'react-dom/client';
import PlaygroundContainer from './components/PlaygroundContainer';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PlaygroundContainer title='React JSON Schema Form Builder' />
  </React.StrictMode>,
);
