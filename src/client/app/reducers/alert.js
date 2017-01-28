import { ACTIONS_TYPES, ALERTS_TYPES } from '../constants'


export const init = {
  show: false,
  timeout: null,
  message: '',
  type: ALERTS_TYPES.info,
}

const alert = (state = init, action) => {
  switch (action.type) {
    case ACTIONS_TYPES.alert.show:
      return {
        ...state,
        message: action.message,
        show: true,
        timeout: action.timeout,
        type: action.alertType,
      }
    case ACTIONS_TYPES.alert.hide:
      return {
        ...init,
      }
    default:
      return state
  }
}
export default alert
