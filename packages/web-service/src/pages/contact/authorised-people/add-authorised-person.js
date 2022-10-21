import { contactURIs, TASKLIST } from '../../../uris.js'
import { checkHasApplication } from '../common/common.js'

import { yesNoPage } from '../../common/yes-no.js'
import { APIRequests, tagStatus } from '../../../services/api-requests.js'
import { addressLine, CONTACT_COMPLETE } from '../common/check-answers/check-answers.js'
import { ContactRoles } from '../common/contact-roles.js'
const { ADD, NAME, POSTCODE, EMAIL, REMOVE } = contactURIs.AUTHORISED_PEOPLE

export const checkData = async (request, h) => {
  const ck = await checkHasApplication(request, h)
  if (ck) {
    return ck
  }

  const journeyData = await request.cache().getData()
  const contacts = await APIRequests.CONTACT.role(ContactRoles.AUTHORISED_PERSON)
    .getByApplicationId(journeyData.applicationId)

  const returnAndClear = async p => {
    await request.cache().clearPageData(p.page)
    return h.redirect(p.uri)
  }

  // Check any that are incomplete because of back-button actions
  for (const contact of contacts) {
    if (!contact.fullName) {
      Object.assign(journeyData, { authorisedPeople: { contactId: contact.id } })
      await request.cache().setData(journeyData)
      return returnAndClear(NAME)
    }

    if (!contact?.contactDetails?.email) {
      Object.assign(journeyData, { authorisedPeople: { contactId: contact.id } })
      await request.cache().setData(journeyData)
      return returnAndClear(EMAIL)
    }

    if (!contact?.address) {
      Object.assign(journeyData, { authorisedPeople: { contactId: contact.id } })
      await request.cache().setData(journeyData)
      return returnAndClear(POSTCODE)
    }
  }

  return null
}

export const getData = async request => {
  const { applicationId } = await request.cache().getData()
  const contacts = await APIRequests.CONTACT.role(ContactRoles.AUTHORISED_PERSON).getByApplicationId(applicationId)
  return {
    contacts: contacts.map(c => ({
      uri: {
        remove: `${REMOVE.uri}?id=${c.id}`,
        name: `${NAME.uri}?id=${c.id}`,
        address: `${POSTCODE.uri}?id=${c.id}`,
        email: `${EMAIL.uri}?id=${c.id}`
      },
      details: [
        { key: 'name', value: c.fullName },
        { key: 'address', value: addressLine(c) },
        { key: 'email', value: c.contactDetails.email }
      ]
    }))
  }
}

export const setData = async request => {
  const journeyData = await request.cache().getData()
  const { applicationId } = journeyData
  if (request.payload['yes-no'] === 'yes') {
    await request.cache().clearPageData(NAME.page)
    await APIRequests.APPLICATION.tags(applicationId).set({ tag: CONTACT_COMPLETE.AUTHORISED_PERSON, tagState: tagStatus.IN_PROGRESS })
  } else {
    await APIRequests.APPLICATION.tags(applicationId).set({ tag: CONTACT_COMPLETE.AUTHORISED_PERSON, tagState: tagStatus.COMPLETE })
  }
  delete journeyData.authorisedPeople
  await request.cache().setData(journeyData)
}

export const completion = async request => {
  const { payload: { 'yes-no': yesNo } } = await request.cache().getPageData()
  return yesNo === 'yes' ? NAME.uri : TASKLIST.uri
}

export const addAuthorisedPerson = yesNoPage({
  page: ADD.page,
  uri: ADD.uri,
  checkData: checkData,
  getData: getData,
  setData: setData,
  completion: completion
})
