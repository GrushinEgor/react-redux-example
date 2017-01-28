import { ACTIONS_TYPES } from './constants'


export const init = {
}

const modals = (state = init, action) => {
  switch (action.type) {
    case ACTIONS_TYPES.modals.showModal:
      return {
        ...state,
        [action.modalName]: action.open,
      }
    default:
      return state
  }
}

export default modals
