/*
 * Mock the hapi request object
 */
const path = 'organisation/uuid'
const req = {
  path,
  payload: {
    name: 'ORGANISATION-A',
    organisation: { foo: 'bar' }
  }
}

/*
 * Mock the hapi response toolkit in order to test the results of the request
 */
const codeFunc = jest.fn()
const typeFunc = jest.fn(() => ({ code: codeFunc }))
const h = { response: jest.fn(() => ({ type: typeFunc, code: codeFunc })) }

/*
 * Create the parameters to mock the openApi context which is inserted into each handler
 */
const context = {
  request: {
    params: {
      organisationId: '1e470963-e8bf-41f5-9b0b-52d19c21cb78'
    }
  }
}

const ts = {
  createdAt: { toISOString: () => '2021-12-07T09:50:04.666Z' },
  updatedAt: { toISOString: () => '2021-12-07T09:50:04.666Z' }
}

const tsR = {
  createdAt: ts.createdAt.toISOString(),
  updatedAt: ts.updatedAt.toISOString()
}

jest.mock('@defra/wls-database-model')

let models
let putOrganisation
const applicationJson = 'application/json'

describe('The updateOrganisation handler', () => {
  beforeAll(async () => {
    models = (await import('@defra/wls-database-model')).models
    putOrganisation = (await import('../put-organisation.js')).default
  })

  it('returns a 201 on successful create', async () => {
    models.organisations = {
      findOrCreate: jest.fn(async () => [{
        dataValues: {
          id: '1e470963-e8bf-41f5-9b0b-52d19c21cb78',
          name: 'ORGANISATION-A',
          organisation: { foo: 'bar' },
          ...ts
        }
      }, true])
    }
    await putOrganisation(context, req, h)
    expect(models.organisations.findOrCreate).toHaveBeenCalledWith({
      defaults: {
        id: expect.any(String),
        name: 'ORGANISATION-A',
        organisation: { foo: 'bar' }
      },
      where: {
        id: context.request.params.organisationId
      }
    })
    expect(h.response).toHaveBeenCalledWith({ id: context.request.params.organisationId, name: 'ORGANISATION-A', foo: 'bar', ...tsR })
    expect(typeFunc).toHaveBeenCalledWith(applicationJson)
    expect(codeFunc).toHaveBeenCalledWith(201)
  })

  it('returns a 200 with an existing key', async () => {
    models.organisations = {
      findOrCreate: jest.fn(async () => ([{ dataValues: { name: 'ORGANISATION-A', organisation: { foo: 'bar' }, ...ts } }, false]))
    }
    await putOrganisation(context, req, h)
    expect(models.organisations.findOrCreate).toHaveBeenCalledWith({
      defaults: {
        id: '1e470963-e8bf-41f5-9b0b-52d19c21cb78',
        name: 'ORGANISATION-A',
        organisation: { foo: 'bar' }
      },
      where: {
        id: '1e470963-e8bf-41f5-9b0b-52d19c21cb78'
      }
    })
    expect(h.response).toHaveBeenCalledWith({ name: 'ORGANISATION-A', foo: 'bar', ...tsR })
    expect(typeFunc).toHaveBeenCalledWith(applicationJson)
    expect(codeFunc).toHaveBeenCalledWith(202)
  })

  it('throws with an query error', async () => {
    models.organisations = { findOrCreate: jest.fn(async () => { throw new Error() }) }
    await expect(async () => {
      await putOrganisation(context, req, h)
    }).rejects.toThrow()
  })
})