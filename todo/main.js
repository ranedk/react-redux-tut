import { createStore } from 'redux'
import todoApp from './reducers/todo'
import {List, Map} from 'immutable'

import React from 'react'
import ReactDOM from 'react-dom'

const initialState = Map();
const store = createStore(todoApp, initialState)

const FilterLink = ({
    filter,
    children
}) => {
    return (
        <a href='#'
            onClick={ e => {
                e.preventDefault();
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter: filter
                })
            }}
        > {children}
        </a>
    )
}

const getVisibleTodos = (
    todos,
    filter
) => {
    switch(filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter(
                t => !t.get('completed')
            );
        case 'SHOW_COMPLETED':
            return todos.filter(
                t => t.get('completed')
            );
        default:
            return todos;
    }
}

let nextId = 0
// Todo React component: We will clean this up soon
class TodoApp extends React.Component {
    render() {
        const visibleTodos = getVisibleTodos(
            this.props.todos,
            this.props.visibilityFilter
        );
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
                    {visibleTodos.map(todo =>
                        <li
                            key={todo.get('id')}
                            onClick={ () => {
                                store.dispatch({
                                    type: 'TOGGLE_TODO',
                                    id: todo.get('id')
                                })
                            }}
                            style={{
                                textDecoration: todo.get('completed') ?
                                    'line-through' : 'none'
                            }}
                        >
                            {todo.get('text')}
                        </li>
                    )}
                </ul>
                <p> Show: &nbsp;
                    <FilterLink filter='SHOW_ALL'>
                        All
                    </FilterLink> |
                    <FilterLink filter='SHOW_ACTIVE'>
                        Active
                    </FilterLink> |
                    <FilterLink filter='SHOW_COMPLETED'>
                        Completed
                    </FilterLink>
                </p>
            </div>
        )
    }
}

const render = () => {
    ReactDOM.render(
        <TodoApp
        todos={store.getState().get('todos')}
        visibilityFilter={store.getState().get('visibilityFilter')}
        />,
        document.getElementById('root')
    )
};

store.subscribe(render);
render();