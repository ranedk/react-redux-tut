import { createStore } from 'redux'
import todoApp from './reducers/todo'
import {List, Map} from 'immutable'

import React from 'react'
import ReactDOM from 'react-dom'

const initialState = Map();
const store = createStore(todoApp, initialState)

let nextId = 0
// Todo React component: We will clean this up soon
class TodoApp extends React.Component {
    render() {
        return (
            <div>
                <input ref={node => {
                    this.input = node;
                }}/>
                <button
                    onClick={() => {
                        store.dispatch({
                            type: 'ADD_TODO',
                            text: this.input.value,
                            id: nextId++
                        });
                        this.input.value = '';
                    }}
                >Add todo
                </button>
                <ul>
                    {this.props.todos.map(todo =>
                        <li key={todo.get('id')}>
                            {todo.get('text')}
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}

const render = () => {
    ReactDOM.render(
        <TodoApp
        todos={store.getState().get('todos')}
        />,
        document.getElementById('root')
    )
};

store.subscribe(render);
render();