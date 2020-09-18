import React from 'react';
import './App.css';


function App() {
    const text = 'React search';
    const list = [
        {"objectId": 1, "title": "react"},
        {"objectId": 2, "title": "react aaa"},
        {"objectId": 3, "title": "hogehoge"},
    ];

    const usePersistentState = (key, initialState) => {
        const [state, updater] = React.useState(localStorage.getItem(key) || initialState);
        React.useEffect((() => localStorage.setItem(key, state)), [state]);
        return [state, updater]
    };

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
    // const {onSearch, searchTerm} = props;
    const handleChange = (event) => {
        onSearch(event.target.value);
    };
    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search" type="text" onChange={handleChange} value={searchTerm} />
        </div>
    )
};

export default App;
