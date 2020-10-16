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

const storyReducer = (state, action) => {
    switch (action.type) {
        case "SET":
            return action.payload.stories;
        case "REMOVE":
            return state.filter(i => (i.objectId != action.payload.objectId));
        default:
            throw new Error("Unknown action")
    }
};


    function App() {
        const text = 'React search';
        const initialList = [
        {"objectId": 1, "title": "react"},
        {"objectId": 2, "title": "react aaa"},
        {"objectId": 3, "title": "hogehoge"},
    ];

    const [searchTerm, setSearchTerm] = usePersistentState("searchTerm", "React");
    const [stories, dispatchStories] = React.useReducer(
        storyReducer
        ,[]);

    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    const getAsyncStories = () => {
        return new Promise((promise, reject) => {
            setTimeout(() => {
                promise(initialList)
            }, 2000);
            // throw new Error("asfaf")
        })
    };

    React.useEffect(
        () => {
            setIsLoading(true);
            getAsyncStories().then((data) => {
                dispatchStories({type: "SET", payload: {stories: data}});
                setIsLoading(false);
            }).catch(() => {
                setIsError(true)
            });
        },
        []
    );

    const handleSearch = value => {
        setSearchTerm(value);
    };

    const searchedStories = stories.filter(function(story) {
        return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const onRemoveItem = (item) => {
        dispatchStories({type: "REMOVE", payload: {objectId: item.objectId}})
    };

  return (
    <div className="App">
        <h1>{ text }</h1>
        <Search onSearch={handleSearch} searchTerm={searchTerm}/>
        { isLoading ? (<div className="Loading">Loading ... </div>)
            : (<List list={searchedStories} onRemoveItem={onRemoveItem} />)
        }
        { isError && <div className="isError">has error</div>}
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
