const counter = (state = 0, action) => {
  switch(action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1

    // Manage undefined actions
    // Good practice
    default:
      return state
  }
}

export default counter