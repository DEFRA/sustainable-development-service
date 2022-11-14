import { contactURIs } from '../../../uris.js'
import { contactNamePage } from '../common/contact-name/contact-name-page.js'
import { contactNameCompletion, getContactData, setContactData } from '../common/contact-name/contact-name.js'
import { checkHasContact } from '../common/common.js'
import { AccountRoles, ContactRoles } from '../common/contact-roles.js'

const { NAME } = contactURIs.INVOICE_PAYER

export const invoiceName = contactNamePage({
  page: NAME.page,
  uri: NAME.uri,
  checkData: checkHasContact(ContactRoles.PAYER, contactURIs.INVOICE_PAYER),
  getData: getContactData(ContactRoles.PAYER),
  setData: setContactData(ContactRoles.PAYER),
  completion: contactNameCompletion(ContactRoles.PAYER, AccountRoles.PAYER_ORGANISATION, contactURIs.INVOICE_PAYER)
}, [ContactRoles.PAYER])
