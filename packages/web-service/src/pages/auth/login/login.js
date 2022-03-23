import Joi from 'joi'
import pageRoute from '../../../routes/page-route.js'
import { APIRequests } from '../../../services/api-requests.js'
import { LOGIN, APPLICATIONS } from '../../../uris.js'
import { authJoiObject } from '../auth.js'

export const completion = async () => APPLICATIONS.uri

export const validator = async payload => {
  const userId = payload['user-id'].toLowerCase()
  Joi.assert({ 'user-id': userId }, authJoiObject)
  const result = await APIRequests.USER.findUserByName(payload['user-id'])

  // The API will have cached the result so it is cheap to get this again in the completion handler where
  // we can easily rewrite to the cache
  if (!result) {
    throw new Joi.ValidationError('ValidationError', [{
      message: 'Unauthorized: email address not found',
      path: ['user-id'],
      type: 'unauthorized',
      context: {
        label: 'user-id',
        value: userId,
        key: 'user-id'
      }
    }], null)
  }
}

// If we have validated then we have an authenticated user and we can save the authorization object
const setData = async request => {
  const result = await APIRequests.USER.findUserByName(request.payload['user-id'].toLowerCase())
  await request.cache().setAuthData(result)
}

export default pageRoute(
  LOGIN.page,
  LOGIN.uri,
  validator,
  completion,
  null,
  setData,
  {
    auth: false
  })
