import React, { Component } from 'react';
import PlaygroundContainer from './PlaygroundContainer';

class App extends Component {
  
  constructor(props) {
    super(props)

    this.ui = props.ui;
    this.state = { text: '', show:false,  mode: 'edit', value: {}};
  }

  componentDidMount() {
    if(this.ui){
      this.getInitialState(this.ui).then(state => this.setState(state));
    }
  }

  async getInitialState(ui) {
    try {
      const brDocument = await ui.document.get();
      const value = await ui.document.field.getValue();
      console.info('Received value ' + value);
      return { mode: brDocument.mode, show: true, value: JSON.parse(value)};
    } catch (error) {
      console.error('Failed to register extension:', error.message);
      console.error('- error code:', error.code);
    }
    return this.state;
  }
  render() {
    console.log('rendereed with: ' + this.state.value);
    return (this.state.show && <PlaygroundContainer
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
