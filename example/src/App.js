import React from 'react';
import PlaygroundContainer from './PlaygroundContainer';

function App(initalvalue, bloomreachcallback) {
  return <PlaygroundContainer
    title='React JSON Schema Form Builder'
    initalvalue={initalvalue}
    bloomreachcallback={bloomreachcallback}
  />;
}

export default App;
