import React from 'react';
import './App.css';


function App() {
    let text = 'Hello'
    let list = [
        1, 3, 4
    ];


  return (
    <div className="App">
        {/* data */}
        <h1>{ text }</h1>
        {/*array loop*/}
        { list.map(i => (<div key={i}>{i}</div>)) }
        {/*use component */}
        <List list={list} />
        {/*state */}
        <Search/>
    </div>
  );
}

const List = props => {
    return props.list.map( i =>
        (<div className="list" key={i} >{ i }</div>)
    )
};

const Search = () => {
    const [searchTerm, setSearchTerm] = React.useState("");
    const SearchChanged = (event) => (
        setSearchTerm(event.target.value)
    );
    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search" type="text" onChange={SearchChanged} />
            <h1>{ searchTerm }</h1>
        </div>
    )
};

export default App;
