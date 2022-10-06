describe('authorised person common', () => {
  beforeEach(() => jest.resetModules())
  describe('the checkAuthorisedPeopleData function ', () => {
    it('redirects to the ADD page if no contacts exist', async () => {
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            role: () => ({
              getByApplicationId: jest.fn(() => [])
            })
          }
        }
      }))
      const request = {
        cache: () => ({
          setData: jest.fn(),
          getData: jest.fn(() => ({
            userId: '0d5509a8-48d8-4026-961f-a19918dfc28b',
            applicationId: '8d79bc16-02fe-4e3c-85ac-b8d792b59b94'
          }))
        })
      }
      const h = {
        redirect: jest.fn()
      }
      const { checkAuthorisedPeopleData } = await import('../common.js')
      await checkAuthorisedPeopleData(request, h)
      expect(h.redirect).toHaveBeenCalledWith('/add-authorised-person')
    })

    it('returns null and sets authorisedPeople.contactId if a contact exists', async () => {
      const mockSetData = jest.fn()
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            role: () => ({
              getByApplicationId: jest.fn(() => [{
                id: '1c3e7655-bb74-4420-9bf0-0bd710987f10'
              }])
            })
          }
        }
      }))
      const request = {
        cache: () => ({
          setData: mockSetData,
          getData: jest.fn(() => ({
            userId: '0d5509a8-48d8-4026-961f-a19918dfc28b',
            applicationId: '8d79bc16-02fe-4e3c-85ac-b8d792b59b94'
          }))
        })
      }
      const h = {
        redirect: jest.fn()
      }
      const { checkAuthorisedPeopleData } = await import('../common.js')
      await checkAuthorisedPeopleData(request, h)
      expect(h.redirect).not.toHaveBeenCalled()
      expect(mockSetData).toHaveBeenCalledWith({
        applicationId: '8d79bc16-02fe-4e3c-85ac-b8d792b59b94',
        authorisedPeople: { contactId: '1c3e7655-bb74-4420-9bf0-0bd710987f10' },
        userId: '0d5509a8-48d8-4026-961f-a19918dfc28b'
      })
    })

    it('returns null if the authorisedPeople.contactId is set', async () => {
      const request = {
        cache: () => ({
          getData: jest.fn(() => ({
            userId: '0d5509a8-48d8-4026-961f-a19918dfc28b',
            applicationId: '8d79bc16-02fe-4e3c-85ac-b8d792b59b94',
            authorisedPeople: { contactId: '35acb529-70bb-4b8d-8688-ccdec837e5d4' }
          }))
        })
      }
      const { checkAuthorisedPeopleData } = await import('../common.js')
      await checkAuthorisedPeopleData(request, { })
    })
  })

  describe('the getAuthorisedPeopleData function ', () => {
    it('returns the contact data when given a query parameter', async () => {
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            getById: jest.fn(() => ({
              id: '35acb529-70bb-4b8d-8688-ccdec837e5d4',
              fullName: 'Peter Hammill'
            }))
          }
        }
      }))
      const request = {
        query: { id: '35acb529-70bb-4b8d-8688-ccdec837e5d4' },
        cache: () => ({
          setData: jest.fn(),
          getData: jest.fn(() => ({}))
        })
      }
      const { getAuthorisedPeopleData } = await import('../common.js')
      const result = await getAuthorisedPeopleData(c => c)(request)
      expect(result).toEqual({ fullName: 'Peter Hammill', id: '35acb529-70bb-4b8d-8688-ccdec837e5d4' })
    })

    it('returns the contact data when contactId is set in the cache', async () => {
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            getById: jest.fn(() => ({
              id: '35acb529-70bb-4b8d-8688-ccdec837e5d4',
              fullName: 'Peter Hammill'
            }))
          }
        }
      }))
      const request = {
        cache: () => ({
          setData: jest.fn(),
          getData: jest.fn(() => ({
            authorisedPeople: { contactId: '35acb529-70bb-4b8d-8688-ccdec837e5d4' }
          }))
        })
      }
      const { getAuthorisedPeopleData } = await import('../common.js')
      const result = await getAuthorisedPeopleData(c => c)(request)
      expect(result).toEqual({ fullName: 'Peter Hammill', id: '35acb529-70bb-4b8d-8688-ccdec837e5d4' })
    })
  })

  describe('the getAuthorisedPeopleCompletion function ', () => {
    it('returns the name page if the contact name is not set', async () => {
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            getById: jest.fn(() => ({
              id: '35acb529-70bb-4b8d-8688-ccdec837e5d4'
            }))
          }
        }
      }))
      const request = {
        cache: () => ({
          clearPageData: jest.fn(),
          getData: jest.fn(() => ({
            authorisedPeople: { contactId: '35acb529-70bb-4b8d-8688-ccdec837e5d4' }
          }))
        })
      }
      const { getAuthorisedPeopleCompletion } = await import('../common.js')
      const result = await getAuthorisedPeopleCompletion(request)
      expect(result).toEqual('/authorised-person-name')
    })

    it('returns the email page if the contact email is not set', async () => {
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            getById: jest.fn(() => ({
              id: '35acb529-70bb-4b8d-8688-ccdec837e5d4',
              fullName: 'Peter Hammill'
            }))
          }
        }
      }))
      const request = {
        cache: () => ({
          clearPageData: jest.fn(),
          getData: jest.fn(() => ({
            authorisedPeople: { contactId: '35acb529-70bb-4b8d-8688-ccdec837e5d4' }
          }))
        })
      }
      const { getAuthorisedPeopleCompletion } = await import('../common.js')
      const result = await getAuthorisedPeopleCompletion(request)
      expect(result).toEqual('/authorised-person-email')
    })

    it('returns the add page if a looked-up address is set', async () => {
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            getById: jest.fn(() => ({
              id: '35acb529-70bb-4b8d-8688-ccdec837e5d4',
              fullName: 'Peter Hammill',
              contactDetails: { email: 'Peter.Hammill@vandergrafgenerator.co.uk' },
              address: { uprn: 1235 }
            }))
          }
        }
      }))
      const request = {
        cache: () => ({
          clearPageData: jest.fn(),
          getData: jest.fn(() => ({
            authorisedPeople: { contactId: '35acb529-70bb-4b8d-8688-ccdec837e5d4' }
          }))
        })
      }
      const { getAuthorisedPeopleCompletion } = await import('../common.js')
      const result = await getAuthorisedPeopleCompletion(request)
      expect(result).toEqual('/add-authorised-person')
    })

    it('returns the add page if an entered address is set', async () => {
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            getById: jest.fn(() => ({
              id: '35acb529-70bb-4b8d-8688-ccdec837e5d4',
              fullName: 'Peter Hammill',
              contactDetails: { email: 'Peter.Hammill@vandergrafgenerator.co.uk' },
              address: { addressLine1: 'Street' }
            }))
          }
        }
      }))
      const request = {
        cache: () => ({
          clearPageData: jest.fn(),
          getData: jest.fn(() => ({
            authorisedPeople: { contactId: '35acb529-70bb-4b8d-8688-ccdec837e5d4' }
          }))
        })
      }
      const { getAuthorisedPeopleCompletion } = await import('../common.js')
      const result = await getAuthorisedPeopleCompletion(request)
      expect(result).toEqual('/add-authorised-person')
    })

    it('returns the postcode page if no postcode is set', async () => {
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            getById: jest.fn(() => ({
              id: '35acb529-70bb-4b8d-8688-ccdec837e5d4',
              fullName: 'Peter Hammill',
              contactDetails: { email: 'Peter.Hammill@vandergrafgenerator.co.uk' }
            }))
          }
        }
      }))
      const request = {
        cache: () => ({
          clearPageData: jest.fn(),
          getData: jest.fn(() => ({
            authorisedPeople: { contactId: '35acb529-70bb-4b8d-8688-ccdec837e5d4' }
          }))
        })
      }
      const { getAuthorisedPeopleCompletion } = await import('../common.js')
      const result = await getAuthorisedPeopleCompletion(request)
      expect(result).toEqual('/authorised-person-postcode')
    })

    it('returns the address page if a lookup result exists', async () => {
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            getById: jest.fn(() => ({
              id: '35acb529-70bb-4b8d-8688-ccdec837e5d4',
              fullName: 'Peter Hammill',
              contactDetails: { email: 'Peter.Hammill@vandergrafgenerator.co.uk' },
              address: { postcode: 'BS44 2JK' }
            }))
          }
        }
      }))
      const request = {
        cache: () => ({
          clearPageData: jest.fn(),
          getData: jest.fn(() => ({
            authorisedPeople: { contactId: '35acb529-70bb-4b8d-8688-ccdec837e5d4' },
            addressLookup: [{ Address: {} }]
          }))
        })
      }
      const { getAuthorisedPeopleCompletion } = await import('../common.js')
      const result = await getAuthorisedPeopleCompletion(request)
      expect(result).toEqual('/authorised-person-address')
    })

    it('returns the address entry if no lookup result exists', async () => {
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            getById: jest.fn(() => ({
              id: '35acb529-70bb-4b8d-8688-ccdec837e5d4',
              fullName: 'Peter Hammill',
              contactDetails: { email: 'Peter.Hammill@vandergrafgenerator.co.uk' },
              address: { postcode: 'BS44 2JK' }
            }))
          }
        }
      }))
      const request = {
        cache: () => ({
          clearPageData: jest.fn(),
          getData: jest.fn(() => ({
            authorisedPeople: { contactId: '35acb529-70bb-4b8d-8688-ccdec837e5d4' }
          }))
        })
      }
      const { getAuthorisedPeopleCompletion } = await import('../common.js')
      const result = await getAuthorisedPeopleCompletion(request)
      expect(result).toEqual('/authorised-person-address-form')
    })
  })
})
