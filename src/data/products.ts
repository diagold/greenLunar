
export interface Product {
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  description: string;
  image: string;

  capabilities: string[];

  features: {
    title: string;
    description: string;
  }[];

  users: string[];

  workflow: {
    number: string;
    title: string;
    description: string;
  }[];
}

export const products: Record<string, Product> = {

  /* =========================================================
     SMS
  ========================================================= */

  sms: {
    name: "SMS",
    shortName: "SMS",
    category: "Business Management Software",

    tagline:
      "Smart management System technology built around the needs of Nigerian Learning Institutions.",

    description:
      "SMS is an indigenous software solution developed by GreenLunar to help organizations manage their operations more efficiently. The platform is designed around the realities of the Nigerian business environment, helping teams organize processes, manage information and gain better visibility into their operations.",

    image: "/images/products/sms.jpg",

    capabilities: [
      "Operational Management",
      "Digital Workflows",
      "Records Management",
      "User Management",
      "Reporting & Analytics",
      "Business Process Automation",
    ],

    features: [
      {
        title: "Centralized Management",
        description:
          "Bring important operational information into a structured digital environment.",
      },
      {
        title: "Digital Workflows",
        description:
          "Reduce manual processes by moving everyday workflows into a centralized platform.",
      },
      {
        title: "Reporting",
        description:
          "Give management better visibility through structured reports and operational data.",
      },
      {
        title: "User Management",
        description:
          "Manage users, permissions and access according to organizational responsibilities.",
      },
    ],

    users: [
      "Businesses",
      "Corporate Organizations",
      "Government Organizations",
      "Institutions",
      "Operational Teams",
    ],

    workflow: [
      {
        number: "01",
        title: "Capture",
        description:
          "Operational information is captured and organized digitally.",
      },
      {
        number: "02",
        title: "Manage",
        description:
          "Teams manage their activities through structured digital workflows.",
      },
      {
        number: "03",
        title: "Monitor",
        description:
          "Management gains better visibility into ongoing operations.",
      },
      {
        number: "04",
        title: "Improve",
        description:
          "Operational data helps organizations identify opportunities for improvement.",
      },
    ],
  },


  /* =========================================================
     EMR
  ========================================================= */

  emr: {
    name: "EMR",
    shortName: "EMR",
    category: "Healthcare Technology",

    tagline:
      "Digital healthcare technology designed around the Nigerian healthcare environment.",

    description:
      "GreenLunar EMR is an Electronic Medical Records solution designed to help healthcare providers move from fragmented paper-based processes to structured digital patient information management.",

    image: "/images/products/emr.jpg",

    capabilities: [
      "Patient Records",
      "Medical History",
      "Clinical Documentation",
      "Healthcare Workflows",
      "Records Management",
      "Reporting",
    ],

    features: [
      {
        title: "Digital Patient Records",
        description:
          "Maintain structured electronic records that make patient information easier to manage.",
      },
      {
        title: "Patient History",
        description:
          "Give authorized healthcare personnel access to relevant patient information and history.",
      },
      {
        title: "Clinical Documentation",
        description:
          "Support structured documentation throughout the patient care process.",
      },
      {
        title: "Healthcare Reporting",
        description:
          "Turn healthcare information into useful operational and management reports.",
      },
    ],

    users: [
      "Hospitals",
      "Clinics",
      "Medical Centres",
      "Healthcare Organizations",
      "Healthcare Professionals",
    ],

    workflow: [
      {
        number: "01",
        title: "Register",
        description:
          "Patient information is captured and organized digitally.",
      },
      {
        number: "02",
        title: "Record",
        description:
          "Clinical and patient information is maintained within the electronic record.",
      },
      {
        number: "03",
        title: "Access",
        description:
          "Authorized personnel can access relevant information when required.",
      },
      {
        number: "04",
        title: "Report",
        description:
          "Healthcare organizations gain better visibility into their operations.",
      },
    ],
  },


  /* =========================================================
     VMS
  ========================================================= */

  vms: {
    name: "VMS",
    shortName: "VMS",
    category: "Visitor Management",

    tagline:
      "Smarter visitor management and access control for modern organizations.",

    description:
      "GreenLunar VMS is a Visitor Management System designed to help organizations register, monitor and manage visitors while improving security, accountability and the overall visitor experience.",

    image: "/images/products/vms.jpg",

    capabilities: [
      "Visitor Registration",
      "Visitor Tracking",
      "Access Management",
      "Host Notifications",
      "Visitor Records",
      "Reporting & Analytics",
    ],

    features: [
      {
        title: "Visitor Registration",
        description:
          "Digitize visitor registration and reduce reliance on manual visitor logs.",
      },
      {
        title: "Access Management",
        description:
          "Support controlled access to facilities by maintaining structured visitor information.",
      },
      {
        title: "Visitor Tracking",
        description:
          "Maintain visibility of visitors entering and leaving your facility.",
      },
      {
        title: "Visitor Records",
        description:
          "Keep organized visitor information for accountability and reporting.",
      },
    ],

    users: [
      "Corporate Offices",
      "Government Facilities",
      "Residential Estates",
      "Schools",
      "Hospitals",
      "Industrial Facilities",
    ],

    workflow: [
      {
        number: "01",
        title: "Register",
        description:
          "Visitor information is captured before or upon arrival.",
      },
      {
        number: "02",
        title: "Verify",
        description:
          "Visitor details can be checked against the relevant access requirements.",
      },
      {
        number: "03",
        title: "Access",
        description:
          "Approved visitors proceed through the organization's access process.",
      },
      {
        number: "04",
        title: "Track",
        description:
          "Visitor activity is maintained digitally for visibility and accountability.",
      },
    ],
  },


  /* =========================================================
     E-TICKETING
  ========================================================= */

  "e-ticketing": {
    name: "E-Ticketing",
    shortName: "E-Ticketing",
    category: "Transportation Technology",

    tagline:
      "Digital ticketing technology that simplifies transportation and passenger management.",

    description:
      "GreenLunar E-Ticketing is a digital transportation solution designed to simplify ticket sales, passenger management and ticket validation while giving operators greater visibility into their transportation operations.",

    image: "/images/products/e-ticketing.jpg",

    capabilities: [
      "Digital Ticket Sales",
      "Ticket Validation",
      "Passenger Management",
      "Trip Management",
      "Revenue Monitoring",
      "Operational Reporting",
    ],

    features: [
      {
        title: "Digital Ticketing",
        description:
          "Enable passengers to purchase and manage tickets through digital channels.",
      },
      {
        title: "Ticket Validation",
        description:
          "Support efficient verification of tickets during passenger boarding.",
      },
      {
        title: "Passenger Management",
        description:
          "Maintain structured passenger and journey information.",
      },
      {
        title: "Revenue Visibility",
        description:
          "Give operators better visibility into ticket sales and transportation revenue.",
      },
    ],

    users: [
      "Transport Operators",
      "Rail Operators",
      "Bus Operators",
      "Government Transport Agencies",
      "Transportation Companies",
    ],

    workflow: [
      {
        number: "01",
        title: "Book",
        description:
          "Passengers select their journey and purchase a digital ticket.",
      },
      {
        number: "02",
        title: "Issue",
        description:
          "The system generates the passenger's digital ticket.",
      },
      {
        number: "03",
        title: "Validate",
        description:
          "The ticket is checked during the boarding process.",
      },
      {
        number: "04",
        title: "Monitor",
        description:
          "Operators gain visibility into passengers, trips and ticket activity.",
      },
    ],
  },


  /* =========================================================
     PROPAY
  ========================================================= */

  propay: {
    name: "ProPay",
    shortName: "ProPay",
    category: "Payment Technology",

    tagline:
      "Digital payment and collection technology built for modern organizations.",

    description:
      "GreenLunar ProPay is a digital payment and collection platform designed to help organizations manage transactions, collections and payment-related operations through a centralized technology environment.",

    image: "/images/products/propay.jpg",

    capabilities: [
      "Digital Payments",
      "Payment Collection",
      "Transaction Management",
      "Payment Tracking",
      "Reconciliation",
      "Reporting",
    ],

    features: [
      {
        title: "Digital Collections",
        description:
          "Give organizations a structured digital channel for managing collections.",
      },
      {
        title: "Transaction Management",
        description:
          "Track payment activity and organize transaction information.",
      },
      {
        title: "Payment Monitoring",
        description:
          "Improve visibility into payment activity across your organization.",
      },
      {
        title: "Reporting & Reconciliation",
        description:
          "Support financial visibility through structured reporting and reconciliation processes.",
      },
    ],

    users: [
      "Businesses",
      "Financial Operations Teams",
      "Government Organizations",
      "Transport Operators",
      "Institutions",
    ],

    workflow: [
      {
        number: "01",
        title: "Collect",
        description:
          "Payments are initiated through supported digital channels.",
      },
      {
        number: "02",
        title: "Process",
        description:
          "Transaction information is captured and organized.",
      },
      {
        number: "03",
        title: "Monitor",
        description:
          "Organizations gain visibility into their payment activity.",
      },
      {
        number: "04",
        title: "Reconcile",
        description:
          "Transaction information supports reconciliation and reporting.",
      },
    ],
  },
};
