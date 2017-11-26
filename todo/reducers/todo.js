import { Map, List, isImmutable} from 'immutable'
import { combineReducers } from 'redux-immutable'

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

const todoApp = combineReducers({
    todos: todos,
    visibilityFilter: visibilityFilter
}) 

export default todoApp