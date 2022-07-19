/*
 * Mock the hapi request object
 */
const path = '/application/uuid/habitat-site/uuid'
const req = {
  path,
  payload: {
    name: 'name'
  }
}

/*
 * Mock the hapi response toolkit in order to test the results of the request
 */
const codeFunc = jest.fn()
const typeFunc = jest.fn(() => ({ code: codeFunc }))
const h = { response: jest.fn(() => ({ type: typeFunc, code: codeFunc })) }

const ts = {
  createdAt: { toISOString: () => '2021-12-07T09:50:04.666Z' },
  updatedAt: { toISOString: () => '2021-12-07T09:50:04.666Z' }
}

const tsR = {
  createdAt: ts.createdAt.toISOString(),
  updatedAt: ts.updatedAt.toISOString()
}

/*
 * Create the parameters to mock the openApi context which is inserted into each handler
 */
const context = {
  request: {
    params: {
      applicationId: '1e470963-e8bf-41f5-9b0b-52d19c21cb77',
      habitatSiteId: '6829ad54-bab7-4a78-8ca9-dcf722117a45'
    }
  }
}

jest.mock('@defra/wls-database-model')

let models
let putHabitatSite
let cache
const applicationJson = 'application/json'

describe('The putHabitatSite handler', () => {
  beforeAll(async () => {
    models = (await import('@defra/wls-database-model')).models
    jest.mock('../validate-relations.js', () => ({ validateRelations: jest.fn(null) }))
    putHabitatSite = (await import('../put-habitat-site.js')).default
    const REDIS = (await import('@defra/wls-connectors-lib')).REDIS
    cache = REDIS.cache
  })

  it('returns a 200 on successful create', async () => {
    models.applicationTypes = {
      findByPk: jest.fn(() => ({ id: '9d62e5b8-9c77-ec11-8d21-000d3a87431b' }))
    }
    models.applications = {
      findByPk: jest.fn(() => ({
        id: '1e470963-e8bf-41f5-9b0b-52d19c21cb77',
        application: {
          applicationTypeId: '9d62e5b8-9c77-ec11-8d21-000d3a87431b'
        }
      }))
    }
    models.habitatSites = {
      findOrCreate: jest.fn(async () => [{ dataValues: { id: 'bar', ...ts } }, true])
    }
    cache.delete = jest.fn()
    cache.save = jest.fn()
    await putHabitatSite(context, req, h)
    expect(cache.delete).toHaveBeenCalledWith('/application/uuid/habitat-site/uuid')
    expect(cache.save).toHaveBeenCalledWith('/application/uuid/habitat-site/uuid', { id: 'bar', ...tsR })
    expect(h.response).toHaveBeenCalledWith({ id: 'bar', ...tsR })
    expect(typeFunc).toHaveBeenCalledWith(applicationJson)
    expect(codeFunc).toHaveBeenCalledWith(201)
  })

  it('returns a 200 on successful update', async () => {
    models.applicationTypes = {
      findByPk: jest.fn(() => ({ id: '9d62e5b8-9c77-ec11-8d21-000d3a87431b' }))
    }
    models.applications = {
      findByPk: jest.fn(() => ({
        id: '1e470963-e8bf-41f5-9b0b-52d19c21cb77',
        application: {
          applicationTypeId: '9d62e5b8-9c77-ec11-8d21-000d3a87431b'
        }
      }))
    }
    models.habitatSites = {
      findOrCreate: jest.fn(async () => [{ dataValues: { id: 'bar', ...ts } }, false]),
      update: jest.fn(async () => [false, [{ dataValues: { id: 'bar', ...ts } }]])
    }
    cache.delete = jest.fn()
    cache.save = jest.fn()
    await putHabitatSite(context, req, h)
    expect(cache.delete).toHaveBeenCalledWith('/application/uuid/habitat-site/uuid')
    expect(cache.save).toHaveBeenCalledWith('/application/uuid/habitat-site/uuid', { id: 'bar', ...tsR })
    expect(h.response).toHaveBeenCalledWith({ id: 'bar', ...tsR })
    expect(typeFunc).toHaveBeenCalledWith(applicationJson)
    expect(codeFunc).toHaveBeenCalledWith(200)
  })

  it('returns a 404 on application not found', async () => {
    models.applications = {
      findByPk: jest.fn(() => null)
    }
    cache.delete = jest.fn()
    await putHabitatSite(context, req, h)
    expect(typeFunc).toHaveBeenCalledWith(applicationJson)
    expect(codeFunc).toHaveBeenCalledWith(404)
  })

  it('throws with an insert error', async () => {
    models.applications = { create: jest.fn(async () => { throw new Error() }) }
    await expect(async () => {
      await putHabitatSite(context, req, h)
    }).rejects.toThrow()
  })
})
