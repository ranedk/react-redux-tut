import { createStore } from 'redux'
import todoApp from './reducers/todo'
import {List, Map} from 'immutable'

import React from 'react'
import {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Provider} from 'react-redux'

// Moved component to its own file
import VisibleTodoList from './components/VisibleTodoList'

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

// AddTodo only uses dispatch
// So we define it using 'let' and override it
// with connect later
let nextId = 0
let AddTodo = ({dispatch}) => {
    let input;
    return (
        <div>
            <input ref={node => {
                input = node;
            }} />
            <button
                onClick={() => {
                    dispatch({
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
/*
AddTodo = connect(
    state => {
        return {}  // connect will not pass any state
    },
    dispatch => {
        return {dispatch} // connect will pass dispatch as is
    }
)(AddTodo)  // Wrap the old AddTodo component to create new

// I can do the above thing using a shortcut
AddTodo = connect(
    null,
    dispatch => {return {dispatch}} 
){AddTodo}
*/
// I can do the above with a further shortcut
AddTodo = connect()(AddTodo);
// This doesn't subscribe to the store and injects dispatch

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