import { createStore } from 'redux'
import todoApp from './reducers/todo'
import {List, Map} from 'immutable'

import React from 'react'
import {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

const initialState = Map();

const Footer = () => {
    return (
        <p> Show: &nbsp;
            <FilterLink filter='SHOW_ALL' > All </FilterLink> |
            <FilterLink filter='SHOW_ACTIVE' > Active </FilterLink> |
            <FilterLink filter='SHOW_COMPLETED' > Completed </FilterLink>
        </p>
    )
}

// AddTodo is a function component, it gets a second parameter
// as context, the first one being props
const AddTodo = (props, context) => {
    let input;
    const store = context.store;
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
// This says that this component will use 'store' in the context
// pass from the provider
AddTodo.contextTypes = {
    store: PropTypes.object
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
        const store = this.context.store;
        this.unsubscribe = store.subscribe(() => 
            this.forceUpdate()
        )
    }

    componentWillUnmount() {
        this.unsubscribe()
    }
    
    render() {
        const props = this.props;
        const store = this.context.store;
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
FilterLink.contextTypes = {
    store: PropTypes.object
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

class VisibleTodoList extends Component {

    componentDidMount() {
        const store = this.context.store;
        this.unsubscribe = store.subscribe(() => 
            this.forceUpdate()
        )
    }

    componentWillUnmount() {
        this.unsubscribe()
    }
    
    render () {
        const props = this.props;
        const store = this.context.store;
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
VisibleTodoList.contextTypes = {
    store: PropTypes.object
}

let nextId = 0

const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);


// Lets create a Provider, which provides all children components
// which context from the top.
// We create a basic component, which simply renders all children
// It implements a getChildContext, which helps pass the context
// to all its children.
class Provider extends Component {
    getChildContext() {
        return {
            store: this.props.store
        }
    }
    render() {
        return this.props.children;
    }
}
// It needs to define the childContentTypes to work! Dont ask why :(
// Hunch is it tells the children to take 'store' key from the passed
// context
Provider.childContextTypes = {
    store: PropTypes.object
}

ReactDOM.render(
    <Provider store={createStore(todoApp, initialState)}>
        <TodoApp/>
    </Provider>,
    document.getElementById('root')
)