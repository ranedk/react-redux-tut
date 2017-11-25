import { Map, List} from 'immutable'

const todos = (state = List([]), action) => {
    switch(action.get('type')) {

        case 'ADD_TODO':
            return state.push(Map({
                id: action.get('id'),
                text: action.get('text'),
                completed: false
            }))

        case 'TOGGLE_TODO':
            return state.map(s => {
                if(s.get('id') == action.get('id')) {
                    return s.update('completed', completed => !completed)
                }
                else {
                    return s
                }
            })
        default:
            return state
    }   
}

export default todos