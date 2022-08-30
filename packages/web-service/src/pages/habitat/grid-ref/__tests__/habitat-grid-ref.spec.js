describe('The habitat grid ref page', () => {
  beforeEach(() => jest.resetModules())

  describe('habitat-grid-ref page', () => {
    it('the habitat-grid-ref page forwards onto habitat-work-start on primary journey', async () => {
      const request = {
        cache: () => ({
          getData: () => ({})
        })
      }
      const { completion } = await import('../habitat-grid-ref.js')
      expect(await completion(request)).toBe('/habitat-work-start')
    })
    it('the habitat-grid-ref page forwards onto check-habitat-answers on return journey', async () => {
      const request = {
        cache: () => ({
          getData: () => ({ complete: true })
        })
      }
      const { completion } = await import('../habitat-grid-ref.js')
      expect(await completion(request)).toBe('/check-habitat-answers')
    })
    it('sets the grid ref data correctly on primary journey', async () => {
      const mockSetData = jest.fn()
      const request = {
        cache: () => ({
          setData: mockSetData,
          getData: () => ({
            habitatData: {}
          }),
          getPageData: () => ({
            payload: {
              'habitat-grid-ref': 'NY123456'
            }
          })
        })
      }
      const { setData } = await import('../habitat-grid-ref.js')
      await setData(request)
      expect(mockSetData).toHaveBeenCalledWith({
        habitatData:
          { gridReference: 'NY123456' }
      })
    })
    it('sets the grid ref data correctly on return journey', async () => {
      const mockSetData = jest.fn()
      const request = {
        query: {
          id: '1e470963-e8bf-41f5-9b0b-52d19c21cb75'
        },
        cache: () => ({
          setData: mockSetData,
          getData: () => ({
            complete: true,
            habitatData: {}
          }),
          getPageData: () => ({
            payload: {
              'habitat-grid-ref': 'NY123456'
            }
          })
        })
      }
      const { setData } = await import('../habitat-grid-ref.js')
      await setData(request)
      expect(mockSetData).toHaveBeenCalledWith({
        complete: true,
        redirectId: '1e470963-e8bf-41f5-9b0b-52d19c21cb75',
        habitatData:
          { gridReference: 'NY123456' }
      })
    })
  })
})
