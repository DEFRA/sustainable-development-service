import Joi from 'joi'
import pageRoute from '../../../routes/page-route.js'
import { habitatURIs } from '../../../uris.js'

const badgerLicenceSeasonOpen = `05-01-${new Date().getFullYear()}` // 1st May
const badgerLicenceSeasonClose = `11-30-${new Date().getFullYear()}` // 30th Nov

export const completion = async _request => habitatURIs.WORK_END.uri

const isDate = date => {
  const isValidDate = Date.parse(date)

  if (isNaN(isValidDate)) {
    return false
  }

  return true
}

const invalidDate = (day, month, year, dateString) => {
  if (day > 31 || day <= 0) {
    return true
  }

  if (month > 12 || month <= 0) {
    return true
  }

  console.log(dateString)
  if (!(/^[\d-]*$/.test(dateString))) { // Validate we just have dashes and numbers
    return true
  }

  return false
}

export const validator = async payload => {
  const day = payload['habitat-work-start-day']
  const month = payload['habitat-work-start-month']
  const year = payload['habitat-work-start-year']
  const dateString = `${month}-${day}-${year}`

  // Empty user validation
  if (day === '' || month === '' || year === '') {
    throw new Joi.ValidationError('ValidationError', [{
      message: 'Error: no date has been sent',
      path: ['habitat-work-start'],
      type: 'no-date-sent',
      context: {
        label: 'habitat-work-start',
        value: 'Error',
        key: 'habitat-work-start'
      }
    }], null)
  }

  // We can immediately return on these values
  if (invalidDate(day, month, year, dateString)) {
    throw new Joi.ValidationError('ValidationError', [{
      message: 'Error: the date is invalid',
      path: ['habitat-work-start'],
      type: 'invalidDate',
      context: {
        label: 'habitat-work-start',
        value: 'Error',
        key: 'habitat-work-start'
      }
    }], null)
  }

  // Ensure the date conforms to a Date() object in JS
  if (!isDate(dateString)) {
    throw new Joi.ValidationError('ValidationError', [{
      message: 'Error: a date cant be parsed from this string',
      path: ['habitat-work-start'],
      type: 'invalidDate',
      context: {
        label: 'habitat-work-start',
        value: 'Error',
        key: 'habitat-work-start'
      }
    }], null)
  }

  // Is this in the past?
  if ((new Date(dateString)).getFullYear() < (new Date()).getFullYear()) {
    throw new Joi.ValidationError('ValidationError', [{
      message: 'Error: a date has been chosen from the past',
      path: ['habitat-work-start'],
      type: 'dateHasPassed',
      context: {
        label: 'habitat-work-start',
        value: 'Error',
        key: 'habitat-work-start'
      }
    }], null)
  }

  // Is the start date within the licence period?
  // Is it before when the badger licence opens and before the badger licence end?
  if ((new Date(dateString)) < (new Date(badgerLicenceSeasonOpen)) || (new Date(dateString)) > (new Date(badgerLicenceSeasonClose))) {
    throw new Joi.ValidationError('ValidationError', [{
      message: 'Error: a date has been chosen from the past',
      path: ['habitat-work-start'],
      type: 'outsideLicence',
      context: {
        label: 'habitat-work-start',
        value: 'Error',
        key: 'habitat-work-start'
      }
    }], null)
  }

  return null
}

export default pageRoute({ page: habitatURIs.WORK_START.page, uri: habitatURIs.WORK_START.uri, completion, validator })
