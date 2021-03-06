import todos from 'reducers/todos'
import {Map, List, fromJS} from 'immutable'

describe('addTodo', () => {
    const stateBefore = List([]);
    // Action need not be immutable
    // React says, actions must be plain objects
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
    }
    const stateAfter = fromJS(
        [
            {
                id: 0,
                text: 'Learn Redux',
                completed: false
            }
        ]
    );

    it("should add a todo", () => {
        expect(todos(stateBefore, action))
        .toEqual(stateAfter);
    })
})

describe('toggleTodo', () => {
    const stateBefore = fromJS([
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        }, {
            id: 1,
            text: 'Learn Javascript',
            completed: false
        }

    ])
    const action = {
        type: 'TOGGLE_TODO',
        id: 1,
    }
    const stateAfter = fromJS([
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        }, {
            id: 1,
            text: 'Learn Javascript',
            completed: true
        }

    ])

    it("should toggle a todo", () => {
        expect(todos(stateBefore, action))
        .toEqual(stateAfter);
    })
})
