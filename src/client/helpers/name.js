export const longName = usr => ([
  usr.last_name,
  usr.first_name,
  usr.second_name,
]
  .join(' '))

export const shortName = usr => ([
  `${usr.last_name} `,
  usr.first_short ? `${usr.first_short.slice(0, 1)}.` : '',
  usr.second_name ? `${usr.second_name.slice(0, 1)}.` : '',
]
  .join(''))

export const fullName = c => (c ? `${c.first_name} ${c.last_name}` : '-')
