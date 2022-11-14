export const ContactRoles = {
  APPLICANT: 'APPLICANT',
  ECOLOGIST: 'ECOLOGIST',
  PAYER: 'PAYER',
  AUTHORISED_PERSON: 'AUTHORISED-PERSON',
  ADDITIONAL_APPLICANT: 'ADDITIONAL-APPLICANT',
  ADDITIONAL_ECOLOGIST: 'ADDITIONAL-ECOLOGIST'
}
export const AccountRoles = {
  APPLICANT_ORGANISATION: 'APPLICANT-ORGANISATION',
  ECOLOGIST_ORGANISATION: 'ECOLOGIST-ORGANISATION',
  PAYER_ORGANISATION: 'PAYER-ORGANISATION'
}
export const contactRoleIsSingular = contactRole => [
  ContactRoles.APPLICANT,
  ContactRoles.ECOLOGIST,
  ContactRoles.PAYER,
  ContactRoles.ADDITIONAL_APPLICANT,
  ContactRoles.ADDITIONAL_ECOLOGIST
].includes(contactRole)

export const accountRoleIsSingular = accountRole => [
  AccountRoles.APPLICANT_ORGANISATION,
  AccountRoles.ECOLOGIST_ORGANISATION,
  AccountRoles.PAYER_ORGANISATION
].includes(accountRole)
