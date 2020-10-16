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
        case "START_FETCH":
            return {
                ...state,
                isLoading: true
            };
        case "FETCH_SUCCEED":
            return {
                ...state,
                isLoading: false,
                hasError: false,
                data: action.payload.stories};
        case "FETCH_ERROR":
            return {
                ...state,
                hasError: true,
                isLoading: false
            };
        case "REMOVE":
            return {
                ...state,
                data: state.filter(i => (i.objectId != action.payload.objectId))
            };
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
        ,{
            data: [],
            isLoading: false,
            hasError: false
        });


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
            dispatchStories({type: "START_FETCH"});
            getAsyncStories().then((data) => {
                dispatchStories({type: "FETCH_SUCCEED", payload: {stories: data}});
            }).catch(() => {
                dispatchStories({type: "FETCH_ERROR"})
            });
        },
        []
    );

    const handleSearch = value => {
        setSearchTerm(value);
    };

    const searchedStories = stories.data.filter(function(story) {
        return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const onRemoveItem = (item) => {
        dispatchStories({type: "REMOVE", payload: {objectId: item.objectId}})
    };

  return (
    <div className="App">
        <h1>{ text }</h1>
        <Search onSearch={handleSearch} searchTerm={searchTerm}/>
        { stories.isLoading ? (<div className="Loading">Loading ... </div>)
            : (<List list={searchedStories} onRemoveItem={onRemoveItem} />)
        }
        { stories.hasError && <div className="hasError">has error</div>}
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
