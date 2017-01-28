import { makeActionsBundle } from 'helpers/actions'


export const NAME = 'app'

export const ALERT_SHOW_TIMEOUT = 4000

export const ALERTS_TYPES = {
  info: 'info',
  warn: 'warn',
  error: 'error',
}

const actionsTypesAlert = [
  'SHOW',
  'HIDE',
]
export const ACTIONS_TYPES = {
  alert: makeActionsBundle(NAME, 'alert', actionsTypesAlert),
}
