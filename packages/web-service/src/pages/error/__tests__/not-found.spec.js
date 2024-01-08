import path from 'path'
import { compileTemplate } from '../../../initialise-snapshot-tests.js'

describe('not-found page', () => {
  beforeEach(() => jest.resetModules())

  describe('the getData', () => {
    it('returns includeHomeLink "true" when included in the query string', async () => {
      const request = {
        query: {
          includeHomeLink: 'true'
        }
      }
      const { getData } = await import('../not-found.js')
      const result = await getData(request)
      expect(result).toEqual({
        includeHomeLink: 'true'
      })
    })

    it('Does not include includeHomeLink when not included in the query string', async () => {
      const request = {
        query: {}
      }
      const { getData } = await import('../not-found.js')
      const result = await getData(request)
      expect(result).not.toEqual({
        includeHomeLink: 'true'
      })
    })
  })

  describe('not-found page template', () => {
    it('Matches the snapshot', async () => {
      const template = await compileTemplate(path.join(__dirname, '../not-found.njk'))

      const renderedHtml = template.render({
        data: {
          includeHomeLink: 'true'
        }
      })

      expect(renderedHtml).toMatchSnapshot()
    })
  })
})
