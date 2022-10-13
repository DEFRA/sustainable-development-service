import Joi from 'joi'
import pageRoute from '../../../routes/page-route.js'
import { APIRequests } from '../../../services/api-requests.js'
import { ecologistExperienceURIs } from '../../../uris.js'
import { SECTION_TASKS } from '../../tasklist/licence-type-map.js'
import { checkApplication } from '../../common/check-application.js'
import { cacheDirect } from '../../../session-cache/cache-decorator.js'
import { restoreInputGetData } from '../../common/restore-input-get-data.js'

export const completion = async request => {
  const journeyData = await request.cache().getData()
  const flagged = await APIRequests.APPLICATION.tags(journeyData.applicationId).has(SECTION_TASKS.ECOLOGIST_EXPERIENCE)
  if (flagged) {
    return ecologistExperienceURIs.CHECK_YOUR_ANSWERS.uri
  }
  return ecologistExperienceURIs.ENTER_METHODS.uri
}

export const setData = async request => {
  const { applicationId } = await request.cache().getData()
  const ecologistExperience = await APIRequests.ECOLOGIST_EXPERIENCE.getExperienceById(applicationId)
  const experienceDetails = request.payload['enter-experience'].replace('\r\n', '\n')
  Object.assign(ecologistExperience, { experienceDetails })
  await APIRequests.ECOLOGIST_EXPERIENCE.putExperienceById(applicationId, ecologistExperience)
}

export const validator = async (payload, context) => {
  // JS post message here sends line breaks with \r\n (CRLF) but the Gov.uk prototypes counts newlines as \n
  // Which leads to a mismatch on the character count as
  // '\r\n'.length == 2
  // '\n'.length   == 1
  const input = payload['enter-experience'].replace('\r\n', '\n')
  const journeyData = await cacheDirect(context).getData()

  if (input === '') {
    throw new Joi.ValidationError('ValidationError', [{
      message: 'Error: no text entered',
      path: ['enter-experience'],
      type: 'string.empty',
      context: {
        label: 'enter-experience',
        value: 'Error',
        key: 'enter-experience'
      }
    }], null)
  }

  if (input.length > 4000) {
    // Store the text in the input, so the user won't lose everything they typed, we'll delete it in getData()
    await cacheDirect(context).setData(Object.assign(journeyData, { tempInput: input }))
    throw new Joi.ValidationError('ValidationError', [{
      message: 'Error: max text input exceeded',
      path: ['enter-experience'],
      type: 'string.max',
      context: {
        label: 'enter-experience',
        value: 'Error',
        key: 'enter-experience'
      }
    }], null)
  }
}

export default pageRoute({
  uri: ecologistExperienceURIs.ENTER_EXPERIENCE.uri,
  page: ecologistExperienceURIs.ENTER_EXPERIENCE.page,
  checkData: checkApplication,
  getData: request => restoreInputGetData(request, 'enter-experience'),
  validator,
  setData,
  completion
})
