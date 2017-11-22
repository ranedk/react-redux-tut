import { createStore } from 'redux'
import counter from './reducers/counter'

const store = createStore(counter)


store.subscribe(() => {
    document.body.innerText = store.getState();
});

document.addEventListener('click', () => {
    store.dispatch({ type: "INCREMENT"})
})