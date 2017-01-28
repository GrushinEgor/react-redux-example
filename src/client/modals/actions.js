import { ACTIONS_TYPES } from './constants'


export const showModal = (open, modalName) => ({
  type: ACTIONS_TYPES.modals.showModal,
  open,
  modalName,
})
