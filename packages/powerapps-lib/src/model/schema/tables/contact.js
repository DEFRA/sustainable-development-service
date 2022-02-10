import { Table, Column } from '../schema.js'
import { address } from './address.js'

export const Contact = new Table('contacts', [
  new Column('firstname', 'firstname'),
  new Column('lastname', 'lastname'),
  new Column('telephone1', 'contactDetails.phone'),
  new Column('emailaddress1', 'contactDetails.email'),
  ...address
], null, null, ['firstname', 'lastname'], 'applications')
