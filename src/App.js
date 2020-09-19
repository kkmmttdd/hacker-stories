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
    const initialList = [
        {"objectId": 1, "title": "react"},
        {"objectId": 2, "title": "react aaa"},
        {"objectId": 3, "title": "hogehoge"},
    ];

    const [searchTerm, setSearchTerm] = usePersistentState("searchTerm", "React");
    const [list, setList] = React.useState(initialList);

    const handleSearch = value => {
        setSearchTerm(value);
    };

    const searchedStories = list.filter(function(story) {
        return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const onRemoveItem = (item) => {
        console.log(item.objectId);
        const newList = list.filter(i => (i.objectId != item.objectId));
        setList(newList)
    };

  return (
    <div className="App">
        <h1>{ text }</h1>
        <Search onSearch={handleSearch} searchTerm={searchTerm}/>
        <List list={searchedStories} onRemoveItem={onRemoveItem} />
    </div>
  );
}

const List = ({list, onRemoveItem}) => list.map( i => <Item key={i.objectId} item={i} onRemoveItem={onRemoveItem} />);

const Item = ({ item, onRemoveItem }) => {
    return (<div className="list" key={item.objectId}>
        {item.title}
        <span>
            <button type="button" onClick={() => onRemoveItem(item)}>
              Dismiss
            </button>
        </span>
    </div>)
};

const Search = ({onSearch, searchTerm}) => {
    return (
        <InputWithLabel id={"id"} htmlFor={"search"} value={searchTerm} onChange={(event) => onSearch(event.target.value)} />
    )
};

export default App;
