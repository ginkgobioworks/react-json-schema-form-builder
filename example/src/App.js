import React, { Component } from 'react';
import PlaygroundContainer from './PlaygroundContainer';

class App extends Component {

  constructor(props) {
    super(props)
    console.log('constructor', props)

    this.ui = props.ui;
    this.state = { text: '', mode: 'edit', value: '{}'};
  }

  componentDidMount() {
    this.getInitialState(this.ui).then(state => this.setState(state));
  }

  async getInitialState(ui) {
    try {
      const brDocument = await ui.document.get();
      const value = await ui.document.field.getValue();
      return { mode: brDocument.mode, value: value };
    } catch (error) {
      console.error('Failed to register extension:', error.message);
      console.error('- error code:', error.code);
    }
    return this.state;
  }
  render() {
    return (<PlaygroundContainer
      title='React JSON Schema Form Builder'
      initalvalue={this.state.value}
      onChange={event => {
        this.setState({ value: event.target.value }, () => {
          if (this.ui) {
            this.ui.document.field.setValue(event.target.value);
          }
        })
      }}
    />);
  }
}


export default App;
