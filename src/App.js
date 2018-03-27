import React, { Component } from 'react';
import Chart from './Chart';
import Input from './Input';
import SheetJSApp from './SheetJSApp';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-intro">
          <SheetJSApp />
        </div>
      </div>
    );
  }
}

export default App;
