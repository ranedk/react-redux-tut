import {connect} from 'react-redux'
import React from 'react'
import {Component} from 'react'
import ReactDOM from 'react-dom'

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

const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id: id
    }
}

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
            dispatch(toggleTodo(id));
        }
    }
}

const VisibleTodoList = connect(
    mapStateToProps,
    mapDispathToProps
)(TodoList);

export default VisibleTodoList