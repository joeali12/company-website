export const COMPANY_NAME = 'VOLT IQ'

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
  { id: 'contact', label: 'Contact' },
] as const

export type TeamMember = {
  id: string
  name: string
  role: string
  linkedin: string
  accent: 'blue' | 'cyan' | 'teal' | 'sky'
  initials: string
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'amar-swar',
    name: 'Amar Swar',
    role: 'Data Engineer & Database Specialist',
    linkedin: 'https://www.linkedin.com/in/amar-swar-026444406/',
    accent: 'blue',
    initials: 'AS',
  },
  {
    id: 'youssef-zaher',
    name: 'Youssef Zaher',
    role: 'AI Engineer',
    linkedin: 'https://www.linkedin.com/in/youssef-zaher-fouda-a13a67356/',
    accent: 'cyan',
    initials: 'YZ',
  },
  {
    id: 'mohamed-elbadaly',
    name: 'Mohamed Elbadaly',
    role: 'AI Engineer',
    linkedin: 'https://www.linkedin.com/in/mo-elbadaly-61697431b/',
    accent: 'teal',
    initials: 'ME',
  },
  {
    id: 'marwan-amin',
    name: 'Marwan Amin',
    role: 'AI Engineer',
    linkedin: 'https://www.linkedin.com/in/marwan-ibrahim-amin/',
    accent: 'sky',
    initials: 'MA',
  },
  {
    id: 'ahmed-afandy',
    name: 'Ahmed Afandy',
    role: 'UI/UX & Frontend Engineer',
    linkedin: 'https://www.linkedin.com/in/ahmed-afandy-a83480320/',
    accent: 'blue',
    initials: 'AA',
  },
  {
    id: 'youssef-aly',
    name: 'Youssef Aly',
    role: 'DevSecOps Engineer specializing in Backend Systems',
    linkedin: 'https://www.linkedin.com/in/youssef2-aly5/',
    accent: 'cyan',
    initials: 'YA',
  },
]

export const SERVICES = [
  {
    id: 'erp',
    title: 'ERP Systems',
    body: 'Connected software to help organize business workflows and information.',
  },
  {
    id: 'saas',
    title: 'SaaS Products',
    body: 'Digital products designed to deliver useful services through the web.',
  },
  {
    id: 'websites',
    title: 'Websites',
    body: 'Purposeful websites that present your business and make it easy for people to connect with you.',
  },
  {
    id: 'applications',
    title: 'Applications',
    body: 'Applications built around a specific task, for people and businesses that need their own software.',
  },
] as const
