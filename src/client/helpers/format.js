import { isDef } from 'helpers/def'


const dimRegexp = /\B(?=(\d{3})+(?!\d))/g

export const toNumber = (value, trim) => {
  let parts = value.replace(/[^\d.,]/g, '').split(/\.|,/)
  parts[0] = parts[0].replace(dimRegexp, ' ')
  parts[1] = parts.slice(1, parts.length).join('')
  parts = parts.slice(0, 2).filter(p => p.length)
  if (parts[1] && isDef(trim)) parts[1] = parts[1].slice(0, trim)
  return parts.join(',')
}

export const fromNumber = (value, trim) => {
  let parts = value.replace('.', ',').replace(/[^\d,]/g, '').split(',')
  if (parts[1] && isDef(trim)) parts[1] = parts[1].slice(0, trim)
  parts = parts.filter(p => p.length)
  return parts.join('.')
}

const billion = 1000000
export const prettyNumber = (number, round, trimDim) => {
  let wasRounded = false
  let roundedValue = number
  if (round && number >= billion) {
    roundedValue = Math.round(roundedValue / billion * 10) / 10
    wasRounded = true
  }
  let result = toNumber(roundedValue.toString())
  if (wasRounded && !trimDim) {
    result += ' млн'
  }
  return result
}

const phoneFormatString = '(...) ...-..-..'
const phoneNumberLength = (phoneFormatString.match(/\./g) || []).length
const phoneFormat = phoneFormatString.split('')

const noDigitsRegexp = /[^\d]/g
export const toPhone = (value) => {
  return phoneFormat.reduce((memo, char) => {
    if (memo.remainingText.length === 0) {
      return memo
    }
    if (char !== '.') {
      return {
        formattedText: memo.formattedText + char,
        remainingText: memo.remainingText,
      }
    }

    return {
      formattedText: memo.formattedText + memo.remainingText[0],
      remainingText: memo.remainingText.slice(1, memo.remainingText.length),
    }
  }, { formattedText: '', remainingText: value.replace(noDigitsRegexp, '') }).formattedText
}

export const fromPhone = (value) => {
  return value.replace(noDigitsRegexp, '').slice(0, phoneNumberLength)
}
