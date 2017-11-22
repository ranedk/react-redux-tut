// import { createStore } from 'redux'
import counter from './reducers/counter'

//const store = createStore(counter)
// How is store implemented?

const createStore = (reducer) => {
    let state;
    let listeners = [];

    const getState = () => state;
    
    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener())
    }

    const subscribe = (listener) => {
        listeners.push(listener)
        // When you can subscribe, it returns
        // a function, if you call that function
        // it automatically unsubscribes itself
        return () => {
            listeners = listeners.filter()
        }
    }

    // To populate the store, dispatch
    // a dummy action, this will initialize
    // state to its initial value
    dispatch({});

    return {getState, dispatch, subscribe}
}

const store = createStore(counter)

const render = () => {
    document.body.innerText = store.getState();
}

store.subscribe(render);
render();

document.addEventListener('click', () => {
    store.dispatch({ type: "INCREMENT"})
})