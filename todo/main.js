import { createStore } from 'redux'
import todoApp from './reducers/todo'
import {List, Map} from 'immutable'

import React from 'react'
import ReactDOM from 'react-dom'

const initialState = Map();
const store = createStore(todoApp, initialState)

const Footer = ({visibilityFilter, onFilterClick}) => {
    return (
        <p> Show: &nbsp;
            <FilterLink
                filter='SHOW_ALL'
                currentFilter={visibilityFilter}
                onFilterClick={onFilterClick}
            >
                All
            </FilterLink> |
            <FilterLink
                filter='SHOW_ACTIVE'
                currentFilter={visibilityFilter}
                onFilterClick={onFilterClick}
            >
                Active
            </FilterLink> |
            <FilterLink
                filter='SHOW_COMPLETED'
                currentFilter={visibilityFilter}
                onFilterClick={onFilterClick}
            >
                Completed
            </FilterLink>
        </p>
    )
}

const AddTodo = ({
    onAddClick
}) => {
    let input;
    return (
        <div>
            <input ref={node => {
                input = node;
            }} />
            <button
                onClick={() => {
                    onAddClick(input.value);
                    input.value = '';
                }}
            >Add todo
            </button>
        </div>
    )
}

const FilterLink = ({
    filter,
    currentFilter,
    onFilterClick,
    children        // React stuff for inner html
}) => {
    if(filter === currentFilter) {
        return <span>{children}</span>
    }
    return (
        <a href='#'
            onClick={ e => {
                e.preventDefault();
                onFilterClick(filter);
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
                <AddTodo
                    onAddClick={text => {
                        store.dispatch({
                            type: 'ADD_TODO',
                            text: text,
                            id: nextId++
                        });
                    }}
                />
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
                <Footer
                    visibilityFilter={visibilityFilter}
                    onFilterClick={(filter) => {
                        store.dispatch({
                            type: 'SET_VISIBILITY_FILTER',
                            filter: filter
                        })
                    }}
                />
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