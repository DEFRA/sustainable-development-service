import pageRoute from '../../../routes/page-route.js'
import { habitatURIs } from '../../../uris.js'

export const completion = async _request => habitatURIs.TYPES.uri

export default pageRoute({ page: habitatURIs.START.page, uri: habitatURIs.START.uri, completion })
