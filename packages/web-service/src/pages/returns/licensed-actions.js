import { ReturnsURIs } from '../../uris.js'
import { isYes, yesNoPage } from '../common/yes-no.js'
import { checkApplication } from '../common/check-application.js'
import { APIRequests } from '../../services/api-requests.js'
import { yesNoFromBool } from '../common/common.js'

const { NIL_RETURN, OUTCOME, WHY_NIL } = ReturnsURIs

export const getData = async request => {
  const journeyData = await request.cache().getData()
  const licences = await APIRequests.LICENCES.findByApplicationId(journeyData?.applicationId)
  journeyData.returns.licenceId = licences[0].id
  const { nilReturn } = await APIRequests.RETURNS.getLicenceReturn(licences[0].id)

  return { yesNo: yesNoFromBool(nilReturn) }
}

export const setData = async request => {
  const journeyData = await request.cache().getData()
  const nilReturn = isYes(request)
  const returnId = journeyData?.returns?.returnId
  const licenceId = journeyData?.returns?.licenceId
  if (returnId && licenceId) {
    const licenceReturn = await APIRequests.RETURNS.getLicenceReturn(licenceId, returnId)
    const payload = { ...licenceReturn, nilReturn }
    await APIRequests.RETURNS.updateLicenceReturn(licenceId, returnId, payload)
  } else {
    const licenceReturn = await APIRequests.RETURNS.createLicenceReturn(licenceId, { nilReturn })
    journeyData.returns = { ...journeyData.returns || {}, nilReturn, returnId: licenceReturn?.id }
  }
  await request.cache().setData(journeyData)
}

export const completion = async request => isYes(request) ? OUTCOME.uri : WHY_NIL.uri

export const licensedActions = yesNoPage({
  page: NIL_RETURN.page,
  uri: NIL_RETURN.uri,
  checkData: checkApplication,
  getData: getData,
  completion: completion,
  setData: setData
})