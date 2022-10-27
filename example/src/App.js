import React from 'react';
import PlaygroundContainer from './PlaygroundContainer';

function App(props) {
  return <PlaygroundContainer
    title='React JSON Schema Form Builder'
    initalvalue={props.initalvalue}
    bloomreachcallback={props.bloomreachcallback}
  />;
}

export default App;
