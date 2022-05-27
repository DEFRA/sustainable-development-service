import { APIRequests } from './api-requests.js'
import db from 'debug'
const debug = db('web-service:application-service')

// This will be replaced by a selected type
const TYPE = 'A24 Badger'

export const ApplicationService = {
  createApplication: async request => {
    const journeyData = await request.cache().getData() || {}
    const application = await APIRequests.APPLICATION.create(TYPE)
    Object.assign(journeyData, { applicationId: application.id })
    await request.cache().setData(journeyData)
    return application.id
  },
  associateApplication: async request => {
    const journeyData = await request.cache().getData()
    const { userId, applicationId } = journeyData
    return APIRequests.APPLICATION.initialize(userId, applicationId)
  },
  submitApplication: async request => {
    const journeyData = await request.cache().getData()
    const { applicationId } = journeyData
    debug(`Submitting applicationId: ${applicationId}`)
    await APIRequests.APPLICATION.submit(applicationId)
  }
}
