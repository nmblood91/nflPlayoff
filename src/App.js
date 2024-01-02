import React from "react";

import './App.css';

import BracketMaker from "./BracketMaker/BracketMaker.js"

class App extends React.Component{

render() {
  return (
    <div className="App">
      <header className="App-header">
        <BracketMaker />
      </header>
    </div>
  );
  }

}

export default App;
