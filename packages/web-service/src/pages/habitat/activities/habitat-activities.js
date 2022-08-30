import Joi from 'joi'
import pageRoute from '../../../routes/page-route.js'
import { habitatURIs } from '../../../uris.js'
import { settDistruptionMethods } from '../../../utils/sett-disturb-methods.js'
import { PowerPlatformKeys } from '@defra/wls-powerapps-keys'
import { APIRequests } from '../../../services/api-requests.js'
import { changeHandler, putData } from '../../../utils/editTools.js'
const page = 'habitat-activities'

const {
  SPECIES: { BADGER },
  ACTIVITY_ID: { INTERFERE_WITH_BADGER_SETT }
} = PowerPlatformKeys

export const completion = async _request => habitatURIs.CHECK_YOUR_ANSWERS.uri

export const getData = async _request => {
  return { settDistruptionMethods }
}

export const setData = async request => {
  const pageData = await request.cache().getPageData()
  const journeyData = await request.cache().getData()

  const activities = [].concat(pageData.payload[page])
  const methodIds = activities.map(method => parseInt(method))
  if (journeyData.complete) {
    Object.assign(journeyData, { redirectId: request.query.id })
    const newSett = await changeHandler(journeyData, journeyData.redirectId)
    Object.assign(journeyData.habitatData, { methodIds })
    await putData(newSett)
  } else {
    const speciesId = BADGER
    const activityId = INTERFERE_WITH_BADGER_SETT
    const complete = true
    Object.assign(journeyData.habitatData, { methodIds, speciesId, activityId })
    Object.assign(journeyData, { complete })
    console.log(journeyData)
    await APIRequests.HABITAT.create(journeyData.habitatData.applicationId, journeyData.habitatData)
  }
  request.cache().setData(journeyData)
}

export const validator = async payload => {
  if (!payload[page]) {
    throw new Joi.ValidationError('ValidationError', [{
      message: 'Error: no way of affecting the sett has been selected',
      path: [page],
      type: 'no-checkbox-selected',
      context: {
        label: page,
        value: 'Error',
        key: page
      }
    }], null)
  }
}

export default pageRoute({ page: habitatURIs.ACTIVITIES.page, uri: habitatURIs.ACTIVITIES.uri, validator, completion, getData, setData })
