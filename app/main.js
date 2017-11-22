import { createStore } from 'redux'
import counter from './reducers/counter'

// Here comes REACT, Why use react!? VirtualDom Diffing!
import React from 'react'
import ReactDOM from 'react-dom'

const store = createStore(counter)

const Counter = ({
    value,
    onIncrement,
    onDecrement
}) => (             // ES6 syntax if return is the only statement
    <div>
        <h1>{value}</h1>
        <button onClick={onIncrement}>+</button>
        <button onClick={onDecrement}>-</button>
    </div>
)

const render = () => {
    ReactDOM.render(
        <Counter
            value={store.getState()}   // return a function
            onIncrement={  //return a function, which returns the callback
                () => {
                    store.dispatch({type: 'INCREMENT'})
                }
            }
            onDecrement={
                () => {
                    store.dispatch({type: 'DECREMENT'})
                }
            }
        />,
        document.getElementById('root')
    )
}

store.subscribe(render);
render();