import pageRoute from '../../routes/page-route.js'
import { ReturnsURIs } from '../../uris.js'
import { checkApplication } from '../common/check-application.js'
import { isDateInFuture } from '../habitat/a24/common/date-validator.js'
import { extractDateFromPageDate, validatePageDate } from '../../common/date-utils.js'
import { APIRequests } from '../../services/api-requests.js'

const { WORK_START, WORK_END } = ReturnsURIs

export const validator = payload => {
  const startDate = validatePageDate(payload, WORK_START.page)

  isDateInFuture(startDate, WORK_START.page)

  return null
}

export const getData = async request => {
  const journeyData = await request.cache().getData()
  const returnId = journeyData?.returns?.returnId
  const licences = await APIRequests.LICENCES.findByApplicationId(journeyData?.applicationId)
  if (returnId) {
    const { startDate } = await APIRequests.RETURNS.getLicenceReturn(licences[0]?.id, returnId)
    if (startDate) {
      const licenceReturnStartDate = new Date(startDate)
      return {
        year: licenceReturnStartDate.getFullYear(),
        month: licenceReturnStartDate.getMonth() + 1,
        day: licenceReturnStartDate.getDate()
      }
    }

    return {
      year: undefined,
      month: undefined,
      day: undefined
    }
  }

  return null
}

export const setData = async request => {
  const pageData = await request.cache().getPageData()

  console.log('hi 9 ==>>  ', pageData)
  const startDate = extractDateFromPageDate(request.orig.payload, WORK_START.page)
  const journeyData = await request.cache().getData()
  console.log('hi 10')
  const returnId = journeyData?.returns?.returnId
  const licenceId = journeyData?.licenceId
  const licenceReturn = await APIRequests.RETURNS.getLicenceReturn(licenceId, returnId)
  const payload = { ...licenceReturn, startDate }
  console.log('hi 11')
  await APIRequests.RETURNS.updateLicenceReturn(licenceId, returnId, payload)
  console.log('hi 12')
  journeyData.returns = { ...licenceReturn, startDate }
  await request.cache().setData(journeyData)
}

export default pageRoute({
  page: WORK_START.page,
  uri: WORK_START.uri,
  completion: WORK_END.uri,
  checkData: checkApplication,
  validator: validator,
  getData: getData,
  setData: setData
})
