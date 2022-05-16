import { models } from '@defra/wls-database-model'
import { APPLICATION_JSON } from '../../../constants.js'
import { SEQUELIZE, REDIS } from '@defra/wls-connectors-lib'
import { clearCaches } from '../application-cache.js'
import { sectionKeyFunc } from './section-keys-func.js'
const { cache } = REDIS

export const putSectionHandler = (section, sddsGetKeyFunc, removeSddsGetKeyFunc, keyFunc) => async (context, req, h) => {
  try {
    const { userId, applicationId } = context.request.params
    const application = await models.applications.findByPk(applicationId)

    // Check the user exists
    if (!application) {
      return h.response().code(404)
    }

    await clearCaches(userId, applicationId)
    const sequelize = SEQUELIZE.getSequelize()

    let targetKeys = application.targetKeys
    const powerAppsKey = sddsGetKeyFunc ? sddsGetKeyFunc(req) : null
    if (powerAppsKey) {
      // (targetKeys, applicationId, section, powerAppsKey, powerAppsTable)
      targetKeys = sectionKeyFunc(targetKeys, applicationId, section, powerAppsKey)
      if (removeSddsGetKeyFunc) {
        removeSddsGetKeyFunc(req)
      }
    }

    const [, updatedApplication] = await models.applications.update({
      application: sequelize.fn('jsonb_set', sequelize.col('application'), `{${section}}`, JSON.stringify(req.payload), true),
      targetKeys: targetKeys,
      updateStatus: 'L'
    }, {
      where: {
        id: applicationId
      },
      returning: ['application']
    })

    const result = updatedApplication[0].dataValues.application[section]

    if (keyFunc) {
      Object.assign(result, keyFunc(targetKeys))
    }

    // Cache
    await cache.save(req.path, result)
    return h.response(result)
      .type(APPLICATION_JSON)
      .code(200)
  } catch (err) {
    console.error('Error updating the APPLICATIONS table', err)
    throw new Error(err.message)
  }
}
