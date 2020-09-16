import React from 'react';
import logo from './logo.svg';
import './App.css';


function App() {
    let text = 'Hello'
    let list = [
        1, 3, 4
    ];
  return (
    <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h1>{ text }</h1>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" />
          { list.map(function(i){ return <div key={i}>{i}</div> }) }
        <List />
    </div>
  );
}

const List = () => {
    let list = [
        5, 6, 7
    ];
    return list.map(i =>
        (
            <div className="list" key={i} >{ i }</div>
        )
    )
};

export default App;
