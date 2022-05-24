import { SEQUELIZE } from '@defra/wls-connectors-lib'
import db from 'debug'

const { DataTypes, QueryTypes } = SEQUELIZE
const debug = db('database-model:define')

const models = {}

async function defineUsers (sequelize) {
  models.users = await sequelize.define('user', {
    id: { type: DataTypes.UUID, primaryKey: true },
    username: { type: DataTypes.STRING(50), allowNull: false }
  }, {
    timestamps: true,
    indexes: [
      { unique: true, fields: ['username'], name: 'user_username_uk' }
    ]
  })
}

async function defineSites (sequelize) {
  models.sites = await sequelize.define('sites', {
    id: { type: DataTypes.UUID, primaryKey: true },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: models.users,
        key: 'id'
      }
    },
    site: { type: DataTypes.JSONB },
    targetKeys: { type: DataTypes.JSONB },
    sddsSiteId: { type: DataTypes.UUID },
    submitted: { type: DataTypes.DATE },
    updateStatus: { type: DataTypes.STRING(1), allowNull: false }
  }, {
    timestamps: true,
    indexes: [
      { unique: false, fields: ['user_id'], name: 'site_user_fk' },
      { unique: true, fields: ['sdds_site_id'], name: 'site_sdds_id_uk' }
    ]
  })
}

async function defineApplications (sequelize) {
  models.applications = await sequelize.define('applications', {
    id: { type: DataTypes.UUID, primaryKey: true },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: models.users,
        key: 'id'
      }
    },
    application: { type: DataTypes.JSONB },
    targetKeys: { type: DataTypes.JSONB },
    sddsApplicationId: { type: DataTypes.UUID },
    submitted: { type: DataTypes.DATE },
    updateStatus: { type: DataTypes.STRING(1), allowNull: false }
  }, {
    timestamps: true,
    indexes: [
      { unique: false, fields: ['user_id'], name: 'application_user_fk' },
      { unique: true, fields: ['sdds_application_id'], name: 'application_sdds_id_uk' }
    ]
  })
}

async function defineUserRoles (sequelize) {
  models.userRoles = await sequelize.define('user-roles', {
    role: { type: DataTypes.STRING(20), primaryKey: true }
  }, {
    timestamps: false,
    indexes: [
      { unique: true, fields: ['role'], name: 'user_roles_uk' }
    ]
  })
}

async function defineApplicationUsers (sequelize) {
  models.applicationUsers = await sequelize.define('application-users', {
    id: { type: DataTypes.UUID, primaryKey: true },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: models.users,
        key: 'id'
      }
    },
    applicationId: {
      type: DataTypes.UUID,
      references: {
        model: models.applications,
        key: 'id'
      }
    },
    role: {
      type: DataTypes.STRING(20),
      references: {
        model: models.userRoles,
        key: 'role'
      }
    }
  }, {
    timestamps: true,
    indexes: [
      { unique: false, fields: ['user_id'], name: 'application_user_user_fk' },
      { unique: false, fields: ['application_id'], name: 'application_user_application_fk' },
      { unique: false, fields: ['role'], name: 'application_user_role_fk' }
    ]
  })
}

async function defineSiteUsers (sequelize) {
  models.siteUsers = await sequelize.define('site-users', {
    id: { type: DataTypes.UUID, primaryKey: true },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: models.users,
        key: 'id'
      }
    },
    siteId: {
      type: DataTypes.UUID,
      references: {
        model: models.sites,
        key: 'id'
      }
    },
    role: {
      type: DataTypes.STRING(20),
      references: {
        model: models.userRoles,
        key: 'role'
      }
    }
  }, {
    timestamps: true,
    indexes: [
      { unique: false, fields: ['user_id'], name: 'site_user_user_fk' },
      { unique: false, fields: ['site_id'], name: 'site_user_site_fk' },
      { unique: false, fields: ['role'], name: 'site_user_role_fk' }
    ]
  })
}

async function defineApplicationSites (sequelize) {
  models.applicationSites = await sequelize.define('application-sites', {
    id: { type: DataTypes.UUID, primaryKey: true },
    userId: { // TODO Remove
      type: DataTypes.UUID,
      references: {
        model: models.users,
        key: 'id'
      }
    },
    applicationId: {
      type: DataTypes.UUID,
      references: {
        model: models.applications,
        key: 'id'
      }
    },
    siteId: {
      type: DataTypes.UUID,
      references: {
        model: models.sites,
        key: 'id'
      }
    },
    sddsApplicationId: { type: DataTypes.UUID },
    sddsSiteId: { type: DataTypes.UUID }
  }, {
    timestamps: true,
    indexes: [
      { unique: false, fields: ['user_id'], name: 'application_site_user_fk' },
      { unique: false, fields: ['application_id'], name: 'application_site_application_fk' },
      { unique: false, fields: ['site_id'], name: 'application_site_site_fk' },
      { unique: true, fields: ['user_id', 'application_id', 'site_id'], name: 'application_site_uk' },
      { unique: true, fields: ['sdds_application_id', 'sdds_site_id'], name: 'sdds_application_site_uk' }
    ]
  })
}

async function defineApplicationTypes (sequelize) {
  models.applicationTypes = await sequelize.define('application-types', {
    id: { type: DataTypes.UUID, primaryKey: true },
    json: { type: DataTypes.JSONB }
  }, {
    timestamps: true
  })
}

async function defineApplicationPurposes (sequelize) {
  models.applicationPurposes = await sequelize.define('application-purposes', {
    id: { type: DataTypes.UUID, primaryKey: true },
    json: { type: DataTypes.JSONB }
  }, {
    timestamps: true
  })
}

async function defineOptionSets (sequelize) {
  models.optionSets = await sequelize.define('option-sets', {
    name: { type: DataTypes.STRING(100), primaryKey: true },
    json: { type: DataTypes.JSONB }
  }, {
    timestamps: true
  })
}

async function defineApplicationRefSeq (sequelize) {
  await sequelize.query('CREATE SEQUENCE IF NOT EXISTS application_ref_seq START  WITH  500000 CACHE 100;')
  models.getApplicationRef = () => sequelize.query('select nextval(\'application_ref_seq\')', { type: QueryTypes.SELECT })
}

const createModels = async () => {
  const sequelize = SEQUELIZE.getSequelize()

  // Define the tables
  await defineUsers(sequelize)
  await defineUserRoles(sequelize)

  await defineApplications(sequelize)
  await defineSites(sequelize)

  await defineApplicationUsers(sequelize)
  await defineSiteUsers(sequelize)

  await defineApplicationSites(sequelize)

  await defineApplicationTypes(sequelize)
  await defineApplicationPurposes(sequelize)
  await defineOptionSets(sequelize)
  await defineApplicationRefSeq(sequelize)

  // Create associations
  models.applications.hasMany(models.applicationUsers)
  models.sites.hasMany(models.siteUsers)

  // Synchronize the model
  await models.users.sync()
  await models.userRoles.sync()

  await models.applications.sync()
  await models.sites.sync()

  await models.applicationUsers.sync()
  await models.siteUsers.sync()

  await models.applicationSites.sync()

  await models.applicationTypes.sync()
  await models.applicationPurposes.sync()
  await models.optionSets.sync()

  // Create user roles
  await models.userRoles.upsert({ role: 'USER' })

  debug('Created database model')
}

export { models, createModels }
