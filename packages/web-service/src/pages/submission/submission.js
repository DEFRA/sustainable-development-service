import pageRoute from '../../routes/page-route.js'
import { SUBMISSION, APPLICATIONS, TASKLIST } from '../../uris.js'
import { Backlink } from '../../handlers/backlink.js'
import { isAppSubmittable } from '../tasklist/licence-type.js'

export const checkData = async (request, h) => {
  const { applicationId } = await request.cache().getData()

  if (!await isAppSubmittable(applicationId)) {
    return h.redirect(TASKLIST.uri)
  }

  return null
}

export default pageRoute({
  page: SUBMISSION.page,
  uri: SUBMISSION.uri,
  completion: APPLICATIONS.uri,
  backlink: Backlink.NO_BACKLINK,
  checkData
})
