import { createStore } from 'redux'
import todoApp from './reducers/todo'
import {List, Map} from 'immutable'

import React from 'react'
import {Component} from 'react'
import ReactDOM from 'react-dom'

const initialState = Map();
const store = createStore(todoApp, initialState)
// I dont like store as a global variable, so the only way to 
// do this is by doing a very DIRTY thing.
// I will create the store in the top level component
// and pass it to its childrens, who will pass it to their children
// Hence, every component will have to take store as a prop
// Instead of doing this, there has to be a better way!

const Footer = () => {
    return (
        <p> Show: &nbsp;
            <FilterLink filter='SHOW_ALL' > All </FilterLink> |
            <FilterLink filter='SHOW_ACTIVE' > Active </FilterLink> |
            <FilterLink filter='SHOW_COMPLETED' > Completed </FilterLink>
        </p>
    )
}

// This looks like the older code where onAddTodoClick was passed
// as a prop, but since the only behavior of AddTodo is to dispatch
// 'ADD_TODO', we should have it as a part of the component itself! 
const AddTodo = () => {
    let input;
    return (
        <div>
            <input ref={node => {
                input = node;
            }} />
            <button
                onClick={() => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        text: input.value,
                        id: nextId++
                    });
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

class FilterLink extends Component {

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

// The Todo component was only passing stuff to bottom components
// We should get rid of that too
class VisibleTodoList extends Component {

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
    
    render () {
        const props = this.props;
        const state = store.getState();
        return (
            <TodoList
                todos={
                    getVisibleTodos(
                        state.get('todos'),
                        state.get('visibilityFilter')
                    )
                }
                onTodoClick={id => {
                    store.dispatch({
                        type: 'TOGGLE_TODO',
                        id: id
                    })
                }
                }
            />
        )
    }
}

let nextId = 0

// The TodoApp is not passing any state to children components
// So we can make it simple
const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);

// We were calling render on store.subscribe, however now since
// the components inside it are forceUpdating themselves on
// store change, we dont need to have this the whole store
// subscription stuff
ReactDOM.render(
    <TodoApp
    todos={store.getState().get('todos')}
    visibilityFilter={store.getState().get('visibilityFilter')}
    />,
    document.getElementById('root')
)