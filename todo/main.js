import { createStore } from 'redux'
import todoApp from './reducers/todo'
import {List, Map, fromJS} from 'immutable'

import React from 'react'
import {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Provider} from 'react-redux'
import VisibleTodoList from './components/VisibleTodoList'

let nextId = 0
const initialState = fromJS({
    todos: [{
        id: 0,
        text: "Initial todo pre-loaded",
        completed: false
    }]
});
nextId = 1

const Footer = () => {
    return (
        <p> Show: &nbsp;
            <FilterLink filter='SHOW_ALL' > All </FilterLink> |
            <FilterLink filter='SHOW_ACTIVE' > Active </FilterLink> |
            <FilterLink filter='SHOW_COMPLETED' > Completed </FilterLink>
        </p>
    )
}

const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        text: text,
        id: nextId++
    }
}

let AddTodo = ({dispatch}) => {
    let input;
    return (
        <div>
            <input ref={node => {
                input = node;
            }} />
            <button
                onClick={() => {
                    dispatch(addTodo(input.value));
                    input.value = '';
                }}
            >Add todo
            </button>
        </div>
    )
}
AddTodo = connect()(AddTodo);


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

const setVisibilityFilter = (filter) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter: filter
    }
}

const mapStateToLinkProps = (
    state,
    ownProps
) => {
    return {
        active: state.get('visibilityFilter') === ownProps.filter
    }
};

const mapDispatchToLinkProps = (
    dispatch,
    ownProps
) => {
    return {
        onLinkClick: () => {
            dispatch(setVisibilityFilter(ownProps.filter))
        }
    }
}

const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
)(Link)


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
