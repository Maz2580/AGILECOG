export interface Project {
  id: string
  slug: string
  title: string
  subtitle: string | null
  category: 'Residential' | 'Commercial' | 'Cultural' | 'Hospitality' | 'Public'
  location: string
  year: number
  description: string | null
  story: string | null
  cover_url: string | null
  images: string[]
  featured: boolean
  published: boolean
  sort_order: number
  created_at: string
}

export interface Enquiry {
  id: string
  name: string
  email: string
  phone: string | null
  project_type: string | null
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
}

export interface Setting {
  key: string
  value: string
}

export type SiteSettings = {
  hero_tagline: string
  hero_sub: string
  projects_count: string
  awards_count: string
  countries_count: string
  years_count: string
  studio_email: string
  studio_phone: string
  studio_address: string
  instagram: string
  linkedin: string
}
