import { makeActionsBundle } from 'helpers/actions'


export const NAME = 'modals'


const actionsTypesModals = [
  'SHOW_MODAL',
]

export const ACTIONS_TYPES = {
  modals: makeActionsBundle(NAME, 'modals', actionsTypesModals),
}
