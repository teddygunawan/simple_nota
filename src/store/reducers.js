const isPrintingReducer = (state = false, action) => {
  switch (action.type) {
    case "PRINTING": {
      return true
    }
    case "FINISH_PRINTING": {
      return false
    }
    default:
      return state
  }
}

const productCartReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD":
      return state
    case "REMOVE":
      return state
    case "EMPTY":
      return state
    default:
      return state
  }
}

export { isPrintingReducer, productCartReducer }
