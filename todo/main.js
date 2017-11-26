import { createStore } from 'redux'
import todoApp from './reducers/todo'
import {List, Map} from 'immutable'

import React from 'react'
import ReactDOM from 'react-dom'

const initialState = Map();
const store = createStore(todoApp, initialState)

const FilterLink = ({
    filter,
    currentFilter,
    children        // React stuff for inner html
}) => {
    if(filter === currentFilter) {
        return <span>{children}</span>
    }
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

// We need to separate the Single Todo as a component
// such that it has NO logic and only knows how to render
// what is passed to it: Presentation layer
const Todo = ({
    onClick,
    completed,
    text
}) => (
        <li
            onClick={onClick}
            style={{
                textDecoration: completed ?
                    'line-through' : 'none'
            }}
        >
            {text}
        </li>
)

// Now TodoList has no behavior in it
const TodoList = ({
    todos,
    onTodoClick
}) => (
    <ul>
        { todos.map(todo =>
            <Todo
                key={todo.get('id')}
                text={todo.get('text')}
                completed={todo.get('completed')}
                onClick={() => onTodoClick(todo.get('id'))}
            />
            // What is the difference between
            // onClick={() => onTodoClick(todo.get('id'))}  and
            // onClick={onTodoClick(todo.get('id')}   !watch out
        )}
    </ul>
)

const getVisibleTodos = (
    todos,
    filter
) => {
    switch(filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter( t => 
                !t.get('completed')
            );
        case 'SHOW_COMPLETED':
            return todos.filter( t =>
                t.get('completed')
            );
        default:
            return todos;
    }
}

let nextId = 0
class TodoApp extends React.Component {
    render() {
        // ES6 goodness
        // Easy shortcut to pull attributes
        // from an object
        const {
            todos,
            visibilityFilter
        } = this.props

        const visibleTodos = getVisibleTodos(
            todos,
            visibilityFilter
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
                <TodoList
                    todos={visibleTodos}
                    onTodoClick={ id => {
                            store.dispatch({
                                type: 'TOGGLE_TODO',
                                id: id
                            })
                        }
                    }
                />
                <p> Show: &nbsp;
                    <FilterLink
                        filter='SHOW_ALL'
                        currentFilter={visibilityFilter}
                    >
                        All
                    </FilterLink> |
                    <FilterLink
                        filter='SHOW_ACTIVE'
                        currentFilter={visibilityFilter}
                    >
                        Active
                    </FilterLink> |
                    <FilterLink
                        filter='SHOW_COMPLETED'
                        currentFilter={visibilityFilter}
                    >
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