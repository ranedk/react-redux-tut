import { createStore } from 'redux'
import todoApp from './reducers/todo'
import {List, Map} from 'immutable'

import React from 'react'
import {Component} from 'react'
import ReactDOM from 'react-dom'

const initialState = Map();
const store = createStore(todoApp, initialState)

// Footer was simply passing the props down, so we should
// get rid of the props and create it prop free.
// Also, all of them had the same code repeated for onClick and
//, currentFilter, so we get rid of those too
const Footer = () => {
    return (
        <p> Show: &nbsp;
            <FilterLink filter='SHOW_ALL' > All </FilterLink> |
            <FilterLink filter='SHOW_ACTIVE' > Active </FilterLink> |
            <FilterLink filter='SHOW_COMPLETED' > Completed </FilterLink>
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

const Link = ({
    active,
    onLinkClick,
    children
}) => {
    if(active) {
        return <span>{children}</span>
    }
    return (
        <a href='#'
            onClick={ e => {
                e.preventDefault();
                onLinkClick();
            }}
        > {children}
        </a>
    )
}

// New FilterLink component takes visibilityFilter from the state
// The onLinkClick is also the same uniform all Link components
class FilterLink extends Component {

    // If the parent component doesn't update on store change
    // This component will render old values, so we need to
    // update this component when store is updated.
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => 
            this.forceUpdate()
        )
    }

    componentWillUnmount() {
        this.unsubscribe()
    }
    
    render() {
        const props = this.props;
        const state = store.getState()

        return (
            <Link
                active={ props.filter == state.get('visibilityFilter') }
                onLinkClick={ () =>
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter: props.filter
                    })
                }
            >
            {props.children}
            </Link>
        )    
    }
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
                <Footer />
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