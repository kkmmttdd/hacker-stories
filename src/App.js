import React from 'react';
import './App.css';

const InputWithLabel = ({id, htmlFor, value, onChange}) => {
    return (
        <>
            <label htmlFor={htmlFor}>Search: </label>
            <input id={id} type="text" onChange={onChange} value={value} />
        </>
    )
};

const usePersistentState = (key, initialState) => {
    const [state, updater] = React.useState(localStorage.getItem(key) || initialState);
    React.useEffect((() => localStorage.setItem(key, state)), [state]);
    return [state, updater]
};

function App() {
    const text = 'React search';
    const list = [
        {"objectId": 1, "title": "react"},
        {"objectId": 2, "title": "react aaa"},
        {"objectId": 3, "title": "hogehoge"},
    ];

    const [searchTerm, setSearchTerm] = usePersistentState("searchTerm2", "React");

    const handleSearch = value => {
        setSearchTerm(value);
    };

    const searchedStories = list.filter(function(story) {
        return story.title.includes(searchTerm);
    });

  return (
    <div className="App">
        <h1>{ text }</h1>
        <Search onSearch={handleSearch} searchTerm={searchTerm}/>
        <List list={searchedStories} />
    </div>
  );
}

const List = ({list}) => list.map( i => <Item key={i.objectId} item={i}/>);

const Item = ({item}) => (<div className="list" key={item.objectId} >{ item.title }</div>)

const Search = ({onSearch, searchTerm}) => {
    const handleChange = (event) => {
        onSearch(event.target.value);
    };
    return (
        <InputWithLabel id={"id"} htmlFor={"search"} value={searchTerm} onChange={handleChange} />
    )
};

export default App;
