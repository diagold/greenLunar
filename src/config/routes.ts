export const routes = {
  home: "/",

  about: "/about",

  contact: "/contact",

  services: {
    all: "/services",
    technology: "/services/technology",
    construction: "/services/construction",
    fitnessWellness: "/services/fitness-wellness",
    mediaEntertainment: "/services/media-entertainment",
    realEstate: "/services/real-estate",
  },
    memberCompany: {
    all: "/member-company",
    hardrock: "/member-company/hardrock",
    hvl: "/member-company/hvl",
    fitnessWellness: "/services/fitness-wellness",
    shinal: "/member-company/media-entertainment",
    realEstate: "/services/real-estate",
  },

  products: {
    sms: "/products/sms",
    emr: "/products/emr",
    vms: "/products/vms",
    eTicketing: "/products/e-ticketing",
    propay: "/products/propay",
  },
} as const;