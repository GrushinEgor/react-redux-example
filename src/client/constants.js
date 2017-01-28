export const server = process.env.API_HOST || `${window.location.protocol}//${window.location.host}`

export const ROUTER_LOCATION_CHANGE_ACTION = '@@router/LOCATION_CHANGE'
export const STATE_REPLACE_ACTION = 'STATE_REPLACE'
