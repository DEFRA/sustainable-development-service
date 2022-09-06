import applications from '../pages/applications/applications.js'
import applicationSummary from '../pages/applications/application-summary.js'
import login from '../pages/auth/login/login.js'
import register from '../pages/auth/register/register.js'
import miscRoutes from './misc-routes.js'
import declaration from '../pages/declaration/declaration.js'
import submission from '../pages/submission/submission.js'
import {
  consent, consentGranted, eligibilityCheck, eligible, landOwner,
  landOwnerPermission, notEligibleLandowner, notEligibleProject
} from '../pages/eligibility/eligibility.js'

import { tasklist } from '../pages/tasklist/tasklist.js'
import { uploadMethodStatement } from '../pages/method-statement/upload-method-statement.js'
import { checkMethodStatement } from '../pages/method-statement/check-method-statement.js'

import { applicantName } from '../pages/contact/applicant/applicant-name.js'
import { applicantNames } from '../pages/contact/applicant/applicant-names.js'
import { applicantUser } from '../pages/contact/applicant/applicant-user.js'
import { applicantEmail } from '../pages/contact/applicant/applicant-email.js'
import { applicantCheckAnswers } from '../pages/contact/applicant/applicant-check-answers.js'
import { applicantOrganisation } from '../pages/contact/applicant/applicant-organisation.js'
import { applicantOrganisations } from '../pages/contact/applicant/applicant-organisations.js'
import { applicantPostcode } from '../pages/contact/applicant/applicant-postcode.js'
import { applicantAddress } from '../pages/contact/applicant/applicant-address.js'
import { applicantAddressForm } from '../pages/contact/applicant/applicant-address-form.js'

import habitatStart from '../pages/habitat/a24/start/habitat-start.js'
import habitatTypes from '../pages/habitat/a24/types/habitat-types.js'
import habitatName from '../pages/habitat/a24/name/habitat-name.js'
import habitatReopen from '../pages/habitat/a24/reopen/habitat-reopen.js'
import habitatEntrances from '../pages/habitat/a24/entrances/habitat-entrances.js'
import habitatActiveEntrances from '../pages/habitat/a24/active-entrances/habitat-active-entrances.js'
import habitatGridRef from '../pages/habitat/a24/grid-ref/habitat-grid-ref.js'
import habitatWorkStart from '../pages/habitat/a24/work-start/habitat-work-start.js'
import habitatWorkEnd from '../pages/habitat/a24/work-end/habitat-work-end.js'
import habitatActivities from '../pages/habitat/a24/activities/habitat-activities.js'
import confirmDelete from '../pages/habitat/a24/confirm-delete/confirm-delete.js'
import checkHabitatAnswers from '../pages/habitat/a24/check-habitat-answers/check-habitat-answers.js'

import { signOut } from '../pages/sign-out/sign-out.js'

const routes = [
  ...applications,
  ...applicationSummary,
  ...login,
  ...register,
  ...declaration,
  ...submission,
  ...uploadMethodStatement,
  ...checkMethodStatement,
  ...landOwner,
  ...landOwnerPermission,
  ...consent,
  ...consentGranted,
  ...notEligibleLandowner,
  ...notEligibleProject,
  ...eligibilityCheck,
  ...eligible,
  ...tasklist,
  ...applicantUser,
  ...applicantName,
  ...applicantNames,
  ...applicantOrganisation,
  ...applicantOrganisations,
  ...applicantEmail,
  ...applicantPostcode,
  ...applicantAddress,
  ...applicantAddressForm,
  ...applicantCheckAnswers,
  ...habitatStart,
  ...habitatName,
  ...habitatActiveEntrances,
  ...habitatGridRef,
  ...habitatTypes,
  ...habitatReopen,
  ...habitatWorkStart,
  ...habitatWorkEnd,
  ...habitatEntrances,
  ...habitatActivities,
  ...checkHabitatAnswers,
  ...confirmDelete,
  signOut,
  ...miscRoutes
]

export default routes
