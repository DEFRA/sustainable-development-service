
import Joi from 'joi'
import { isDate } from './is-date.js'
import { invalidDate } from './invalid-date.js'

const throwJoiError = (pageName, message, type) => {
  throw new Joi.ValidationError('ValidationError', [{
    message: message,
    path: [pageName],
    type: type,
    context: {
      label: pageName,
      value: 'Error',
      key: pageName
    }
  }], null)
}

export const validateDates = (payload, pageName) => {
  const badgerLicenceSeasonOpen = `05-01-${new Date().getFullYear()}` // 1st May
  const badgerLicenceSeasonClose = `11-30-${new Date().getFullYear()}` // 30th Nov

  const day = payload[`${pageName}-day`]
  const month = payload[`${pageName}-month`]
  const year = payload[`${pageName}-year`]

  const dateString = `${month}-${day}-${year}`

  // Empty user validation
  if (day === '' || month === '' || year === '') {
    throwJoiError(pageName, 'Error: no date has been sent', 'no-date-sent')
  }

  // We can immediately return on these values
  if (invalidDate(day, month, dateString)) {
    throwJoiError(pageName, 'Error: the date is invalid', 'invalidDate')
  }

  // Ensure the date conforms to a Date() object in JS
  if (!isDate(dateString)) {
    throwJoiError(pageName, 'Error: a date cant be parsed from this string', 'invalidDate')
  }

  // Is this in the past?
  if ((new Date(dateString)) < (new Date())) {
    throwJoiError(pageName, 'Error: a date has been chosen from the past', 'dateHasPassed')
  }

  // Is the start date within the licence period?
  // Is it after when the badger licence opens and before the badger licence end?
  if ((new Date(dateString)) < (new Date(badgerLicenceSeasonOpen)) || (new Date(dateString)) > (new Date(badgerLicenceSeasonClose))) {
    throwJoiError(pageName, 'Error: a date has been chosen outside the licence period', 'outsideLicence')
  }
}
