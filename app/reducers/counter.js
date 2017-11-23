const counter = (state = 0, action) => {
  switch(action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1

    default:
      return state
  }
}

export const addCounter = (list) => {
  // This is bad, changing state is BAD! WTF?!
  // list.push(0); 
  // return list;

  // See what I did here
  // change bhi kar diya aur pata bhi nahin chala
  // change the object in a way that a new object
  // is created and returned.
  // ImmutableJS helps us do these things, we'll see
  return list.concat([0])
}

export default counter