import { createStore } from 'redux'
import todoApp from './reducers/todo'
import {List, Map} from 'immutable'

import React from 'react'
import ReactDOM from 'react-dom'

const initialState = Map();
const store = createStore(todoApp, initialState)

console.log("Initial State")
console.log(store.getState().toString());
console.log("----------------")

console.log("Dispatching ADD_TODO");
store.dispatch({
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn redux'
})

console.log("New State")
console.log(store.getState().toString());
console.log("----------------")

console.log("Dispatching ADD_TODO");
store.dispatch({
    type: 'ADD_TODO',
    id: 1,
    text: 'Learn Python'
})

console.log("New State")
console.log(store.getState().toString());
console.log("----------------")

console.log("Dispatching TOGGLE_TODO");
store.dispatch({
    type: 'TOGGLE_TODO',
    id: 1,
})

console.log("New State")
console.log(store.getState().toString());
console.log("----------------")

console.log("Dispatching SET_VISIBILITY_FILTER");
store.dispatch({
    type: 'SET_VISIBILITY_FILTER',
    filter: 'COMPLETED',
})

console.log("New State")
console.log(store.getState().toString());
console.log("----------------")
