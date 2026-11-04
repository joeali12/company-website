/**
 * Editable site placeholders.
 * Replace bracketed values with real company details when available.
 * Do not present placeholders as verified facts in marketing copy elsewhere.
 */
export const COMPANY_NAME = '[Company name]'
export const LEGAL_ENTITY_NAME = '[Legal company name]'

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'about', label: 'About' },
  { id: 'team', label: 'Team' },
  { id: 'contact', label: 'Contact' },
] as const

export type TeamMember = {
  id: string
  name: string
  role: string
  bio: string
  accent: 'violet' | 'cyan' | 'amber' | 'teal'
}

/**
 * Placeholder team profiles only.
 * Replace with real people when confirmed. Do not invent identities.
 */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    name: '[Name]',
    role: '[Role]',
    bio: '[Short bio]',
    accent: 'violet',
  },
  {
    id: 'member-2',
    name: '[Name]',
    role: '[Role]',
    bio: '[Short bio]',
    accent: 'cyan',
  },
  {
    id: 'member-3',
    name: '[Name]',
    role: '[Role]',
    bio: '[Short bio]',
    accent: 'amber',
  },
  {
    id: 'member-4',
    name: '[Name]',
    role: '[Role]',
    bio: '[Short bio]',
    accent: 'teal',
  },
]
