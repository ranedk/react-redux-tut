import { createStore } from 'redux'
import todoApp from './reducers/todo'
import {List, Map} from 'immutable'

import React from 'react'
import {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

// This existed already!! So much typing Saved
import {Provider} from 'react-redux'

// Can you see a pattern here?!:

// Components need to re-render when the store state changes,
// they need to unsubscribe from the store when they mount and 
// they take the current state of the store and use it to render
// the presentational components with some props that they
// calculate from the state, and they also need to specify
// the contexttypes to get this store from the context.

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

/******** VisibleTodoList Component Simplified *************/
const mapStateToProps = (state) => {
    return {
        todos: getVisibleTodos(
            state.get('todos'),
            state.get('visibilityFilter')
        )
    }
}

const mapDispathToProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch({
                type: 'TOGGLE_TODO',
                id: id
            })
        }
    }
}

const VisibleTodoList = connect(
    mapStateToProps,
    mapDispathToProps
)(TodoList);            // TodoList must be PRESENTATIONAL only

/**************************************************** */

let nextId = 0

const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);

ReactDOM.render(
    <Provider store={createStore(todoApp, initialState)}>
        <TodoApp/>
    </Provider>,
    document.getElementById('root')
)