import { createStore } from 'redux'
import counter from './reducers/counter'

const store = createStore(counter)

const render = () => {
    document.body.innerText = store.getState();
}

store.subscribe(render);

// Initial value of the state wasn't rendered
// Now, with render function, we can do that
render();

document.addEventListener('click', () => {
    store.dispatch({ type: "INCREMENT"})
})