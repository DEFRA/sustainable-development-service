
describe('contact-name page', () => {
  beforeEach(() => jest.resetModules())
  it('the validator works as expected with negative result', async () => {
    jest.doMock('../../../../../session-cache/cache-decorator.js', () => ({
      cacheDirect: () => ({
        getData: () => ({ userId: '8d79bc16-02fe-4e3c-85ac-b8d792b59b94' })
      })
    }))
    jest.doMock('../../../../../services/api-requests.js', () => ({
      APIRequests: {
        CONTACT: {
          role: () => ({
            findByUser: jest.fn(() => [{ fullName: 'Keith Moon' }])
          })
        }
      }
    }))
    const payload = {
      name: 'keith  moon'
    }
    const { getValidator } = await import('../contact-name-page.js')
    const validator = getValidator('APPLICANT')
    await expect(() => validator(payload, {})).rejects.toThrow()
  })

  it('the validator works as expected with positive result', async () => {
    jest.doMock('../../../../../session-cache/cache-decorator.js', () => ({
      cacheDirect: () => ({
        getData: () => ({ userId: '8d79bc16-02fe-4e3c-85ac-b8d792b59b94' })
      })
    }))
    jest.doMock('../../../../../services/api-requests.js', () => ({
      APIRequests: {
        CONTACT: {
          role: () => ({
            findByUser: jest.fn(() => [{ fullName: 'Brian O\'connor-Jones' }])
          })
        }
      }
    }))
    const payload = {
      name: 'keith  moon'
    }
    const { getValidator } = await import('../contact-name-page.js')
    const validator = getValidator('APPLICANT')
    await expect(() => validator(payload, {})).resolves
  })

  it('the validator works as expected with duplicate authorized persons', async () => {
    jest.doMock('../../../../../session-cache/cache-decorator.js', () => ({
      cacheDirect: () => ({
        getData: () => ({ userId: '8d79bc16-02fe-4e3c-85ac-b8d792b59b94' })
      })
    }))
    jest.doMock('../../../../../services/api-requests.js', () => ({
      APIRequests: {
        CONTACT: {
          role: () => ({
            getByApplicationId: jest.fn(() => [{ fullName: 'Keith Moon' }])
          })
        }
      }
    }))
    const payload = {
      name: 'keith  moon'
    }
    const { getValidator } = await import('../contact-name-page.js')
    const validator = getValidator(['AUTHORISED-PERSON'])
    await expect(() => validator(payload, {})).rejects.toThrow()
  })

  it('the validator works as expected with non-duplicate single role', async () => {
    jest.doMock('../../../../../session-cache/cache-decorator.js', () => ({
      cacheDirect: () => ({
        getData: () => ({ userId: '8d79bc16-02fe-4e3c-85ac-b8d792b59b94' })
      })
    }))
    jest.doMock('../../../../../services/api-requests.js', () => ({
      APIRequests: {
        CONTACT: {
          role: () => ({
            getByApplicationId: jest.fn(() => ({ fullName: 'Keith Moon' })),
            getByUserId: jest.fn(() => [{ fullName: 'Keith Moon' }])
          })
        }
      }
    }))
    const payload = {
      name: 'keith  moon'
    }
    const { getValidator } = await import('../contact-name-page.js')
    const validator = getValidator(['ECOLOGIST'])
    await expect(() => validator(payload, {})).rejects.toThrow()
  })
})
