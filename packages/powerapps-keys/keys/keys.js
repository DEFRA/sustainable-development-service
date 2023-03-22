export const PowerPlatformKeys = {
  APPLICATION_TYPES: {
    A24: '9d62e5b8-9c77-ec11-8d21-000d3a87431b'
  },
  APPLICATION_PURPOSES: {
    DEVELOPMENT: '3db073af-201b-ec11-b6e7-0022481a8f18'
  },
  SPECIES: {
    BADGER: 'fedb14b6-53a8-ec11-9840-0022481aca85',
    BEAVERS: '95583cbd-53a8-ec11-9840-0022481aca85',
    BUZZARD: 'd85612c4-53a8-ec11-9840-0022481aca85',
    RAVEN: 'e22614ca-53a8-ec11-9840-0022481aca85',
    RED_KITES: '3b8d5ad6-53a8-ec11-9840-0022481aca85'
  },
  SPECIES_SUBJECT: {
    BADGER: '60ce79d8-87fb-ec11-82e5-002248c5c45b',
    BATS: 'e4af9af9-682f-ed11-9db1-0022481b5cc7',
    GREAT_CRESTED_NEWTS: 'f506efdf-4a2f-ed11-9db1-0022481b5cc7'
  },
  SETT_TYPE: {
    MAIN_NO_ALTERNATIVE_SETT: 100000000,
    MAIN_WITH_ALTERNATIVE_SETTS: 100000001,
    ANNEXE: 100000002,
    OUTLIER: 100000003,
    SUBSIDIARY: 100000006
  },
  BACKEND_STATUS: {
    RECEIVED: 1,
    AWAITING_ALLOCATION: 100000000,
    ALLOCATED_FOR_ASSESSMENT: 100000001,
    UNDER_ASSESSMENT: 100000002,
    GRANTED: 100000004,
    PAUSED: 100000005,
    NOT_GRANTED: 100000008,
    EXPIRED: 452120001,
    WITHDRAWN: 100000006
  },
  ACTIVITY_ID: {
    INTERFERE_WITH_BADGER_SETT: '68855554-59ed-ec11-bb3c-000d3a0cee24'
  },
  METHOD_IDS: {
    OBSTRUCT_SETT_WITH_GATES: 100000010,
    OBSTRUCT_SETT_WITH_BLOCK_OR_PROOF: 100000011,
    DAMAGE_A_SETT: 100000012,
    DESTROY_A_SETT: 100000013,
    DISTURB_A_SETT: 100000014
  },
  APPLICATION_CATEGORY: {
    BARN_CONVERSION: 100000004,
    COMMERCIAL: 100000019,
    COMMUNICATIONS: 100000017,
    ENERGY_GENERATION__ENERGY_SUPPLY: 100000016,
    FLOOD_AND_COASTAL_DEFENCES: 100000007,
    HOUSING__NON_HOUSEHOLDER: 100000001,
    INDUSTRIAL__MANUFACTURING: 100000003,
    MINERAL_EXTRACTION__QUARRYING: 100000005,
    NATIONALLY_SIGNIFICANT_INFRASTRUCTURE_PROJECTS: 100000018,
    PUBLIC_BUILDINGS_AND_LAND: 100000008,
    TOURISM__LEISURE: 100000010,
    TRANSPORT__HIGHWAYS: 100000012,
    WASTE_MANAGEMENT: 100000014,
    WATER_SUPPLY_AND_TREATMENT__WATER_ENVIRONMENT: 100000015
  },
  PAYMENT_EXEMPT_REASON: {
    PRESERVING_PUBLIC_HEALTH_AND_SAFETY: 452120000,
    PREVENT_DISEASE_SPREAD: 452120003,
    PREVENT_DAMAGE_TO_LIVESTOCK_CROPS_TIMBER_OR_PROPERTY: 452120002,
    HOUSEHOLDER_HOME_IMPROVEMENTS: 452120001,
    SCIENTIFIC_RESEARCH_OR_EDUCATION: 452120004,
    CONSERVATION_OF_PROTECTED_SPECIES: 452120005,
    CONSERVATION_OF_A_MONUMENT_OR_BUILDING: 452120006,
    OTHER: 452120007
  },
  PERMISSION_TYPE: {
    PLANNING_PERMISSION: 452120000,
    DEMOLITION_CONSENT: 452120001,
    LISTED_BUILDING_CONSENT: 452120002,
    HIGHWAYS_ACT_CONSENT: 452120003,
    MINERAL_CONSENT: 452120004,
    CONSERVATION_AREA_CONSENT: 452120005,
    TREE_PRESERVATION_ORDER: 452120006,
    UTILITIES_CONSENT: 452120007
  },
  NO_PERMISSION_REQUIRED: {
    PERMITTED_DEVELOPMENT: 452120000,
    HEALTH_AND_SAFETY: 452120001,
    OTHER: 452120002
  },
  PLANNING_PERMISSION_TYPE: {
    FULL: 452120000,
    OUTLINE: 452120001,
    HYBRID: 452120002,
    OTHER: 452120003
  },
  SITE_TYPE: {
    SITE_OF_SPECIAL_SCIENTIFIC_INTEREST: { option: 100000001, abbr: 'SSSI' },
    SPECIAL_PROTECTION_AREA: { option: 100000002, abbr: 'SPA' },
    SPECIAL_AREA_OF_CONSERVATION: { option: 100000003, abbr: 'SAC' },
    RAMSAR_SITE: { option: 100000004, abbr: 'RAMSAR' }
  },
  ON_SITE_OR_CLOSE_TO_SITE: {
    ON: 100000000,
    NEXT_TO: 100000001
  }
}
