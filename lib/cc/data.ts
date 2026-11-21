export const ISSUE_CATEGORIES = [
  'Flood/Waterlogging',
  'Medical',
  'Road/Traffic',
  'Power',
  'Landslide',
  'Fire',
] as const

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number]
export type IssueStatus = 'active' | 'resolved'
export type IssuePriority = 'low' | 'medium' | 'high'

export type Issue = {
  id: string
  title: string
  category: IssueCategory
  location: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  upvotes: number
  upvotedByMe: boolean
  createdAt: number
  resolvedAt?: number
}

export const URGENT_UPVOTE_THRESHOLD = 10

const PRIORITY_WEIGHT: Record<IssuePriority, number> = { high: 30, medium: 15, low: 0 }

export function urgencyScore(issue: Issue) {
  return PRIORITY_WEIGHT[issue.priority] + issue.upvotes
}

export function isUrgent(issue: Issue) {
  return issue.status === 'active' && (issue.priority === 'high' || issue.upvotes >= URGENT_UPVOTE_THRESHOLD)
}

export function sortByUrgency(issues: Issue[]) {
  return [...issues].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1
    const diff = urgencyScore(b) - urgencyScore(a)
    return diff !== 0 ? diff : b.createdAt - a.createdAt
  })
}

type SeedIssue = Omit<Issue, 'createdAt' | 'upvotedByMe' | 'resolvedAt'> & { minutesAgo: number }

const SEED_ISSUES: SeedIssue[] = [
  {
    id: 'seed-1',
    title: 'Knee-deep waterlogging after overnight rain',
    category: 'Flood/Waterlogging',
    location: 'Anil Nagar, near Nabin Nagar bylane 3',
    description:
      'Water has entered ground-floor homes. Two-wheelers stranded and the drain towards the Bharalu is completely choked.',
    status: 'active',
    priority: 'high',
    upvotes: 24,
    minutesAgo: 22,
  },
  {
    id: 'seed-2',
    title: 'B-negative blood donor needed urgently',
    category: 'Medical',
    location: 'Nemcare Hospital, Bhangagarh',
    description:
      'Accident patient in surgery needs 2 units of B-negative blood. Donors please contact the hospital blood bank.',
    status: 'active',
    priority: 'high',
    upvotes: 31,
    minutesAgo: 48,
  },
  {
    id: 'seed-3',
    title: 'Transformer sparking near the crossing',
    category: 'Power',
    location: 'Maligaon Chariali',
    description:
      'Loud sparks from the transformer every few minutes since evening. Shops nearby have switched off. APDCL informed but no team yet.',
    status: 'active',
    priority: 'high',
    upvotes: 17,
    minutesAgo: 70,
  },
  {
    id: 'seed-4',
    title: 'Massive traffic jam due to waterlogging under flyover',
    category: 'Road/Traffic',
    location: 'Jalukbari Flyover, NH-27 service road',
    description: 'Vehicles stuck for over 40 minutes. Ambulances heading to GMCH are unable to pass.',
    status: 'active',
    priority: 'medium',
    upvotes: 12,
    minutesAgo: 35,
  },
  {
    id: 'seed-5',
    title: 'Cracks and soil sliding on hill slope',
    category: 'Landslide',
    location: 'Noonmati, Kharghuli hill road',
    description:
      'Fresh cracks on the retaining wall above three houses after continuous rain. Families advised to stay alert.',
    status: 'active',
    priority: 'high',
    upvotes: 9,
    minutesAgo: 110,
  },
  {
    id: 'seed-6',
    title: 'Deep potholes causing two-wheeler accidents',
    category: 'Road/Traffic',
    location: 'GS Road, near Ganeshguri flyover',
    description: 'Three large potholes on the left lane are hidden under rainwater. One scooter skidded this morning.',
    status: 'active',
    priority: 'medium',
    upvotes: 8,
    minutesAgo: 190,
  },
  {
    id: 'seed-7',
    title: 'Dengue cases rising — fogging requested',
    category: 'Medical',
    location: 'Beltola, Survey area',
    description: 'At least 5 dengue cases on the same lane this week. Stagnant water in an empty plot nearby.',
    status: 'active',
    priority: 'medium',
    upvotes: 6,
    minutesAgo: 260,
  },
  {
    id: 'seed-8',
    title: 'Relief camp needs dry food and tarpaulin',
    category: 'Flood/Waterlogging',
    location: 'Hatigaon Higher Secondary School',
    description: 'Around 60 people sheltering after houses flooded. Needs drinking water, chira, and tarpaulin sheets.',
    status: 'active',
    priority: 'medium',
    upvotes: 14,
    minutesAgo: 140,
  },
  {
    id: 'seed-9',
    title: 'Streetlights not working on campus road',
    category: 'Power',
    location: 'Gauhati University Campus, near Central Library',
    description: 'The stretch from the main gate to the hostels has been dark for 4 nights. Students feel unsafe.',
    status: 'active',
    priority: 'low',
    upvotes: 5,
    minutesAgo: 400,
  },
  {
    id: 'seed-10',
    title: 'Fire in a godown — under control',
    category: 'Fire',
    location: 'Fancy Bazaar, near Panbazar',
    description: 'Fire & Emergency Services doused the fire within an hour. No injuries reported.',
    status: 'resolved',
    priority: 'high',
    upvotes: 22,
    minutesAgo: 720,
  },
  {
    id: 'seed-11',
    title: 'Power outage restored after cable fault',
    category: 'Power',
    location: 'Dispur, Last Gate area',
    description: 'APDCL repaired the underground cable fault. Supply restored for all blocks.',
    status: 'resolved',
    priority: 'medium',
    upvotes: 7,
    minutesAgo: 1440,
  },
  {
    id: 'seed-12',
    title: 'Fallen tree removed from road',
    category: 'Road/Traffic',
    location: 'Maligaon, near NF Railway HQ',
    description: 'GMC crew cleared the tree that fell during the storm. Road is open.',
    status: 'resolved',
    priority: 'low',
    upvotes: 3,
    minutesAgo: 2100,
  },
]

export function buildSeedIssues(now: number): Issue[] {
  return SEED_ISSUES.map(({ minutesAgo, ...issue }) => ({
    ...issue,
    upvotedByMe: false,
    createdAt: now - minutesAgo * 60_000,
    resolvedAt: issue.status === 'resolved' ? now - (minutesAgo - 60) * 60_000 : undefined,
  }))
}

export type ContactCategory = 'Emergency' | 'Medical' | 'Disaster' | 'Utilities' | 'Support'

export type EmergencyContact = {
  id: string
  name: string
  number: string
  category: ContactCategory
  description: string
  area: string
  hours: string
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'c1',
    name: 'National Emergency Response (ERSS)',
    number: '112',
    category: 'Emergency',
    description: 'Single number for police, fire, and ambulance anywhere in India.',
    area: 'All of Assam',
    hours: '24/7',
  },
  {
    id: 'c2',
    name: 'Assam Police',
    number: '100',
    category: 'Emergency',
    description: 'Crime, theft, fights, missing persons, and law & order emergencies.',
    area: 'Guwahati Police Commissionerate',
    hours: '24/7',
  },
  {
    id: 'c3',
    name: 'Fire & Emergency Services',
    number: '101',
    category: 'Emergency',
    description: 'Fires, gas cylinder blasts, building collapse, and rescue operations.',
    area: 'Panbazar Fire Station & city units',
    hours: '24/7',
  },
  {
    id: 'c4',
    name: 'Mrityunjoy 108 Ambulance',
    number: '108',
    category: 'Medical',
    description: 'Free emergency ambulance service across Assam for accidents and medical emergencies.',
    area: 'All of Assam',
    hours: '24/7',
  },
  {
    id: 'c5',
    name: 'Guwahati Medical College Hospital (GMCH)',
    number: '0361-2529457',
    category: 'Medical',
    description: 'Largest government hospital in the region with trauma centre, blood bank, and anti-venom.',
    area: 'Bhangagarh',
    hours: 'Emergency 24/7',
  },
  {
    id: 'c6',
    name: 'Nemcare Hospital',
    number: '0361-2456111',
    category: 'Medical',
    description: 'Multi-speciality private hospital with 24-hour emergency and ICU.',
    area: 'GS Road, Bhangagarh',
    hours: 'Emergency 24/7',
  },
  {
    id: 'c7',
    name: 'Down Town Hospital',
    number: '0361-2331003',
    category: 'Medical',
    description: 'Emergency care, cardiac unit, and ambulance support.',
    area: 'GS Road, Dispur',
    hours: 'Emergency 24/7',
  },
  {
    id: 'c8',
    name: 'Janani / 102 Ambulance',
    number: '102',
    category: 'Medical',
    description: 'Free transport for pregnant women and newborns to government hospitals.',
    area: 'All of Assam',
    hours: '24/7',
  },
  {
    id: 'c9',
    name: 'ASDMA State Emergency Operation Centre',
    number: '1070',
    category: 'Disaster',
    description: 'Assam State Disaster Management Authority — floods, landslides, earthquakes, relief camps.',
    area: 'Dispur',
    hours: '24/7',
  },
  {
    id: 'c10',
    name: 'ASDMA Disaster Helpline (District)',
    number: '1079',
    category: 'Disaster',
    description: 'Kamrup Metro district control room for rescue boats, evacuation, and relief.',
    area: 'Kamrup Metropolitan',
    hours: '24/7',
  },
  {
    id: 'c11',
    name: 'NDRF 1st Battalion',
    number: '0361-2840284',
    category: 'Disaster',
    description: 'National Disaster Response Force for large-scale flood and landslide rescue.',
    area: 'Patgaon, Azara',
    hours: '24/7',
  },
  {
    id: 'c12',
    name: 'APDCL Power Complaint',
    number: '1912',
    category: 'Utilities',
    description: 'Power outages, sparking transformers, and fallen electric lines.',
    area: 'All of Assam',
    hours: '24/7',
  },
  {
    id: 'c13',
    name: 'LPG Gas Leak Emergency',
    number: '1906',
    category: 'Utilities',
    description: 'Report LPG cylinder or pipeline leaks. Leave the area before calling.',
    area: 'All of India',
    hours: '24/7',
  },
  {
    id: 'c14',
    name: 'Guwahati Municipal Corporation',
    number: '0361-2540136',
    category: 'Utilities',
    description: 'Drain clogging, garbage, fallen trees, and waterlogging complaints.',
    area: 'Panbazar',
    hours: 'Mon–Sat, 10am–5pm',
  },
  {
    id: 'c15',
    name: 'Guwahati Traffic Police Control',
    number: '0361-2540126',
    category: 'Utilities',
    description: 'Traffic jams, signal failures, and road blockages across the city.',
    area: 'Panbazar',
    hours: '24/7',
  },
  {
    id: 'c16',
    name: 'Women Helpline',
    number: '181',
    category: 'Support',
    description: 'Support for women facing harassment, violence, or unsafe situations.',
    area: 'All of Assam',
    hours: '24/7',
  },
  {
    id: 'c17',
    name: 'Childline',
    number: '1098',
    category: 'Support',
    description: 'Emergency help for children in distress, lost, or in danger.',
    area: 'All of India',
    hours: '24/7',
  },
  {
    id: 'c18',
    name: 'Tele MANAS Mental Health',
    number: '14416',
    category: 'Support',
    description: 'Free, confidential mental health counselling in Assamese, Hindi, and English.',
    area: 'All of India',
    hours: '24/7',
  },
  {
    id: 'c19',
    name: 'Cyber Crime Helpline',
    number: '1930',
    category: 'Support',
    description: 'Report online fraud, UPI scams, and financial cyber crime immediately.',
    area: 'All of India',
    hours: '24/7',
  },
]

export const CONTACT_CATEGORIES: ContactCategory[] = ['Emergency', 'Medical', 'Disaster', 'Utilities', 'Support']

export function telHref(number: string) {
  return `tel:${number.replace(/[^\d+]/g, '')}`
}
