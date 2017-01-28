import * as format from 'helpers/format'


const TEXT = 'text'
const MULTI = 'multi'
const PASSWORD = 'password'
const PHONE = 'phone'
const MONEY = 'money'
const EMAIL = 'email'

export const INPUT_TYPES = {
  [TEXT]: TEXT,
  [MULTI]: MULTI,
  [PASSWORD]: PASSWORD,
  [PHONE]: PHONE,
  [MONEY]: MONEY,
  [EMAIL]: EMAIL,
}

const ERROR_EMAIL = 'Введенное значение не является адресом электронной почты!'
const ERROR_FORMAT = 'Введенное значение не соответствует формату!'
const ERROR_MAX_LEN = 'Введенное значение не может быть больше ${number} символов!'
const ERROR_MIN_LEN = 'Введенное значение должно содержать как минимум ${number} символов!'
const ERROR_REQUIRED = 'Значение не может быть пустым!'

export const ERROR_TYPES = {
  email: ERROR_EMAIL,
  format: ERROR_FORMAT,
  maxLen: ERROR_MAX_LEN,
  minLen: ERROR_MIN_LEN,
  required: ERROR_REQUIRED,
}

export const MAX_FRACTIONALS = 2
export const formatToFunctions = {
  [PHONE]: format.toPhone,
  [MONEY]: value => {
    let number = format.toNumber(value, MAX_FRACTIONALS)
    if (value.endsWith(',') || value.endsWith('.')) {
      number = `${number},`
    }
    return number
  },
}

export const formatFromFunctions = {
  [PHONE]: format.fromPhone,
  [MONEY]: value => format.fromNumber(value, MAX_FRACTIONALS),
}

export const includeForTypes = {
  [PHONE]: /\d/,
  [MONEY]: /\d|\.|,/,
}

export const excludeForTypes = {}

export const ROW_HEIGHT = 18
