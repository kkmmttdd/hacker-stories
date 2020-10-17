import React from 'react';
import './App.css';
import axios from 'axios'

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

const FETCH_URL =  "https://hn.algolia.com/api/v1/search?query=";

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
                data: state.data.filter(i => (i.objectId != action.payload.objectId))
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
    const [externalSearchTerm, setExternalSearchTerm] = React.useState()

    const [stories, dispatchStories] = React.useReducer(
        storyReducer
        ,{
            data: [],
            isLoading: false,
            hasError: false
        });


    // const getAsyncStories = (searchTerm) => {
    //     return new Promise((resolve, reject) => {
    //         axios.get(`${FETCH_URL}${searchTerm}`)
    //             .then(result => resolve(result.data.hits))
    //             .catch(err => reject(err));
    //         // throw new Error("asfaf")
    //     })
    // };

    const getAsyncStories = async () => {
        // const result = await axios.get(`${FETCH_URL}${searchTerm}`).catch(err => reject(err));
        const result = await axios.get(`${FETCH_URL}${searchTerm}`);
        // resolve(result.data.hits)
        return result.data.hits
    };

    React.useEffect(
        () => {
            dispatchStories({type: "START_FETCH"});
            getAsyncStories(externalSearchTerm).then((data) => {
                dispatchStories({type: "FETCH_SUCCEED", payload: {stories: data}});
            }).catch((err) => {
                console.log(err);
                dispatchStories({type: "FETCH_ERROR", payload: {message: err}});
            });
        },
        [externalSearchTerm]
    );

    const handleSearch = value => {
        setSearchTerm(value);
    };

    const onRemoveItem = (item) => {
        dispatchStories({type: "REMOVE", payload: {objectId: item.objectId}})
    };

    const handleSearchSubmit = (event) => {
        setExternalSearchTerm(searchTerm)
    };

  return (
    <div className="App">
        <h1>{ text }</h1>
        <Search onSearch={handleSearch} searchTerm={searchTerm}/>
        { stories.isLoading ? (<div className="Loading">Loading ... </div>)
            : (<List list={stories.data} onRemoveItem={onRemoveItem} />)
        }
        { stories.hasError && <div className="hasError">has error</div>}
        <button
            type="button"
            // disabled={!searchTerm}
            onClick={handleSearchSubmit}
        >
            Submit
        </button>
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
