import Joi from 'joi'
import pageRoute from '../../../routes/page-route.js'
import { APIRequests } from '../../../services/api-requests.js'
import { ecologistExperienceURIs } from '../../../uris.js'
import { checkApplication } from '../../common/check-application.js'
import { restoreInputGetData } from '../../common/restore-input-get-data.js'

const key = 'enter-experience'

export const completion = async request => {
  const { applicationId } = await request.cache().getData()
  const ecologistExperience = await APIRequests.ECOLOGIST_EXPERIENCE.getExperienceById(applicationId)

  if (!ecologistExperience.methodExperience) {
    return ecologistExperienceURIs.ENTER_METHODS.uri
  }

  if (ecologistExperience.classMitigation === undefined) {
    return ecologistExperienceURIs.CLASS_MITIGATION.uri
  }

  return ecologistExperienceURIs.CHECK_YOUR_ANSWERS.uri
}

export const setData = async request => {
  const { applicationId } = await request.cache().getData()
  const ecologistExperience = await APIRequests.ECOLOGIST_EXPERIENCE.getExperienceById(applicationId)
  const experienceDetails = request.payload[key].replaceAll('\r\n', '\n')
  Object.assign(ecologistExperience, { experienceDetails })
  await APIRequests.ECOLOGIST_EXPERIENCE.putExperienceById(applicationId, ecologistExperience)
}

export default pageRoute({
  uri: ecologistExperienceURIs.ENTER_EXPERIENCE.uri,
  page: ecologistExperienceURIs.ENTER_EXPERIENCE.page,
  checkData: checkApplication,
  getData: request => restoreInputGetData(request, key),
  validator: Joi.object({
    // JS post message here sends line breaks with \r\n (CRLF) but the Gov.uk prototypes counts newlines as \n
    // Which leads to a mismatch on the character count as
    // '\r\n'.length == 2
    // '\n'.length   == 1
    'enter-experience': Joi.string().required().replace('\r\n', '\n').max(4000)
  }).options({ abortEarly: false, allowUnknown: true }),
  setData,
  completion
})
