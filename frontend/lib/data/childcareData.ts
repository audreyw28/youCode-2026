export interface ChildcareProgram {
  program_name: string;
  location_address: string;
  signup_phone_number: string | null;
  wheelchair_accessible: boolean;
  latitude: number;
  longitude: number;
  population_served: string;
  transit_steps: string[];
}

export const childcarePrograms: ChildcareProgram[] = [
  {
    program_name: 'Downtown Eastside Family Place Emergency Childcare',
    location_address: '573 East Hastings St, Vancouver, BC V6A 1P9',
    signup_phone_number: '(604) 251-2995',
    wheelchair_accessible: true,
    latitude: 49.281262,
    longitude: -123.091816,
    population_served: 'Drop-in care for children ages 0-6 during crisis appointments and housing intake.',
    transit_steps: [
      'Walk to the nearest eastbound stop on Hastings Street.',
      'Take any bus serving Main Street and exit at Hastings Street near Princess Avenue.',
      'Cross at the marked signal and continue east for one block.',
      'Check in at the family desk and ask for the emergency childcare intake clipboard.',
    ],
  },
  {
    program_name: 'Crabtree Corner Emergency Childcare Room',
    location_address: '533 East Hastings St, Vancouver, BC V6A 1P9',
    signup_phone_number: '(604) 216-1653',
    wheelchair_accessible: true,
    latitude: 49.281501,
    longitude: -123.092398,
    population_served: 'Short-term childcare for women and children attending safety planning or legal appointments.',
    transit_steps: [
      'Ride transit toward Main Street and East Hastings Street.',
      'Exit at the Hastings Street stop closest to Dunlevy Avenue.',
      'Walk west half a block to 533 East Hastings Street.',
      'Tell the front desk you need the emergency childcare check-in.',
    ],
  },
  {
    program_name: 'Mount Pleasant Crisis Nursery',
    location_address: '800 East Broadway, Vancouver, BC V5T 1Y1',
    signup_phone_number: '(604) 879-8208',
    wheelchair_accessible: true,
    latitude: 49.262154,
    longitude: -123.086769,
    population_served: 'Evening and same-day childcare support for caregivers attending court, work, or housing meetings.',
    transit_steps: [
      'Travel on the 99 B-Line, 9, or 20 toward Broadway and Fraser.',
      'Exit near East Broadway and Fraser Street.',
      'Walk east along Broadway to 800 East Broadway.',
      'Go to reception and request the crisis nursery sign-in form.',
    ],
  },
  {
    program_name: 'South Vancouver Safe Start Childcare',
    location_address: '6810 Main St, Vancouver, BC V5X 0A1',
    signup_phone_number: '(604) 718-6505',
    wheelchair_accessible: true,
    latitude: 49.2229,
    longitude: -123.1006,
    population_served: 'Emergency after-school and preschool care for families moving between shelters and temporary housing.',
    transit_steps: [
      'Take the 3 or 8 bus toward Main Street South.',
      'Exit at Main Street and East 52nd Avenue.',
      'Walk south to 6810 Main Street and enter through the community services doors.',
      'Ask staff for the Safe Start childcare intake sheet.',
    ],
  },
  {
    program_name: 'West Side Family Relief Childcare',
    location_address: '2690 Larch St, Vancouver, BC V6K 4K9',
    signup_phone_number: '(604) 257-6976',
    wheelchair_accessible: true,
    latitude: 49.2621,
    longitude: -123.1601,
    population_served: 'Temporary childcare spots for caregivers attending job interviews, settlement services, or urgent appointments.',
    transit_steps: [
      'Take transit to Broadway and Macdonald Street.',
      'Transfer to a local bus toward Kitsilano and exit near West 10th Avenue.',
      'Walk south to 2690 Larch Street.',
      'Sign in with the family support desk for a relief childcare slot.',
    ],
  },
];
