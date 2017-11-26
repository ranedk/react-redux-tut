import { Map, List, isImmutable} from 'immutable'

const todo = (state, action) => {
    switch(action.type) {
        case 'ADD_TODO':
            return Map({
                id: action.id,
                text: action.text,
                completed: false
            })

        case 'TOGGLE_TODO':
            return state.update('completed', completed => !completed)
    }
}

export const todos = (state = List([]), action) => {
    switch(action.type) {

        case 'ADD_TODO':
            return state.push(
                todo(undefined, action)
            )

        case 'TOGGLE_TODO':
            return state.map(s => {
                if(s.get('id') == action.id) {
                    return todo(s, action)
                }
                else {
                    return s
                }
            })
        default:
            return state
    }
}

const visibilityFilter = (state='SHOW_ALL', action) => {
    switch(action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter
        default:
            return state
    }
}

// Instead of changing my app, I can combine
// independent reducers using a basic reducer composition
// Pretty easy to understand
const todoApp = (state = Map({}), action) => {
    // Initial action is dispatched by React called "@@INIT"
    // which is not supposed to be handled.
    return Map({
        todos: todos(
            state.get('todos'), action
        ),
        visibilityFilter: visibilityFilter(
            state.get('visibilityFilter'), action
        )
    })
}

export default todoApp