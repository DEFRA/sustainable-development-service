
describe('The enter experience page', () => {
  beforeEach(() => jest.resetModules())

  describe('completion function', () => {
    it('returns the enter methods uri on primary journey', async () => {
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          APPLICATION: {
            tags: () => ({
              has: () => false
            })
          }
        }
      }))
      const request = {
        cache: () => ({
          getData: () => ({
            applicationId: '26a3e94f-2280-4ea5-ad72-920d53c110fc'
          })
        })
      }
      const { completion } = await import('../enter-experience.js')
      expect(await completion(request)).toBe('/enter-methods')
    })

    it('returns the check ecologist answers uri on return journey', async () => {
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          APPLICATION: {
            tags: () => ({
              has: () => true
            })
          }
        }
      }))
      const request = {
        cache: () => ({
          getData: () => ({
            applicationId: '26a3e94f-2280-4ea5-ad72-920d53c110fc'
          })
        })
      }
      const { completion } = await import('../enter-experience.js')
      expect(await completion(request)).toBe('/check-ecologist-answers')
    })
  })

  describe('the set data function', () => {
    it('stores the experience details', async () => {
      const mockPut = jest.fn()
      jest.doMock('../../../../services/api-requests.js', () => ({
        APIRequests: {
          ECOLOGIST_EXPERIENCE: {
            getExperienceById: jest.fn(() => ({})),
            putExperienceById: mockPut
          }
        }
      }))
      const request = {
        payload: {
          'enter-experience': 'experience'
        },
        cache: () => ({
          getData: () => ({
            applicationId: '26a3e94f-2280-4ea5-ad72-920d53c110fc'
          })
        })
      }

      const { setData } = await import('../enter-experience.js')
      await setData(request)
      expect(mockPut).toHaveBeenCalledWith('26a3e94f-2280-4ea5-ad72-920d53c110fc', { experienceDetails: 'experience' })
    })
  })

  describe('validator function', () => {
    it('raises a joi error on an empty text input', async () => {
      const payload = { 'enter-experience': '' }
      const context = { context: { state: { sid: { id: 123 } } } }
      jest.doMock('../../../../session-cache/cache-decorator.js', () => ({
        cacheDirect: () => {
          return {
            getData: () => { },
            setData: () => { }
          }
        }
      }))
      try {
        const { validator } = await import('../enter-experience.js')
        expect(await validator(payload, context))
      } catch (e) {
        expect(e.message).toBe('ValidationError')
        expect(e.details[0].message).toBe('Error: no text entered')
      }
    })

    it('raises a joi error if the user enters more than 4,000 characters', async () => {
      const fourThousandAndOneChars = 'dsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsdsdsddsdsdsdsdsd'
      const payload = { 'enter-experience': fourThousandAndOneChars }
      const setCacheMock = jest.fn()
      const context = { context: { state: { sid: { id: 123 } } } }
      jest.doMock('../../../../session-cache/cache-decorator.js', () => ({
        cacheDirect: () => {
          return {
            getData: () => { return {} },
            setData: setCacheMock
          }
        }
      }))
      try {
        const { validator } = await import('../enter-experience.js')
        expect(await validator(payload, context))
      } catch (e) {
        expect(e.message).toBe('ValidationError')
        expect(e.details[0].message).toBe('Error: max text input exceeded')
        expect(setCacheMock).toHaveBeenCalledWith({ tempInput: fourThousandAndOneChars })
      }
    })
  })
})
