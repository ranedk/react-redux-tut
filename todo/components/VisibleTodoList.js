import { connect } from 'react-redux';
import { toggleTodo } from '../actions';
import TodoList from './TodoList';

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
      return todos.filter(t =>
        !t.get('completed')
      );
    case 'SHOW_COMPLETED':
      return todos.filter(t =>
        t.get('completed')
      );
    default:
      return todos;
  }
}

const mapStateToProps = (state) => ({
  todos: getVisibleTodos(
    state.get('todos'),
    state.get('visibilityFilter')
  )
})

const mapDispathToProps = (dispatch) => ({
  onTodoClick: (id) => {
    dispatch(toggleTodo(id));
  }
})

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispathToProps
)(TodoList);

export default VisibleTodoList;
