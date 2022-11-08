describe('authorised person name', () => {
  beforeEach(() => jest.resetModules())
  describe('the setData function', () => {
    it('set the contact name correctly for a new contact', async () => {
      const mockCreate = jest.fn(() => ({ id: '35acb529-70bb-4b8d-8688-ccdec837e5d4' }))
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            getById: () => ({ id: '35acb529-70bb-4b8d-8688-ccdec837e5d4' }),
            isImmutable: () => false,
            role: () => ({
              create: mockCreate
            })
          }
        }
      }))
      const request = {
        payload: {
          name: 'Peter Hammill'
        },
        cache: () => ({
          setData: jest.fn(),
          getData: jest.fn(() => ({
            userId: '0d5509a8-48d8-4026-961f-a19918dfc28b',
            applicationId: '8d79bc16-02fe-4e3c-85ac-b8d792b59b94'
          }))
        })
      }
      const { setData } = await import('../authorised-person-name.js')
      await setData(request)
      expect(mockCreate).toHaveBeenCalledWith('8d79bc16-02fe-4e3c-85ac-b8d792b59b94', { fullName: 'Peter Hammill' })
    })
    it('set the contact name correctly for an existing contact', async () => {
      const mockUpdate = jest.fn()
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          CONTACT: {
            getById: () => ({ id: '35acb529-70bb-4b8d-8688-ccdec837e5d4' }),
            isImmutable: () => false,
            update: mockUpdate
          }
        }
      }))
      const request = {
        query: {
          id: '35acb529-70bb-4b8d-8688-ccdec837e5d4'
        },
        payload: {
          name: 'Peter Hammill'
        },
        cache: () => ({
          setData: jest.fn(),
          getData: jest.fn(() => ({
            userId: '0d5509a8-48d8-4026-961f-a19918dfc28b',
            applicationId: '8d79bc16-02fe-4e3c-85ac-b8d792b59b94'
          }))
        })
      }
      const { setData } = await import('../authorised-person-name.js')
      await setData(request)
      expect(mockUpdate).toHaveBeenCalledWith('35acb529-70bb-4b8d-8688-ccdec837e5d4', { fullName: 'Peter Hammill' })
    })
  })
})
