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
  studio_email: string
  studio_phone: string
  studio_address: string
  instagram: string
  linkedin: string
  gallery_painting_1_label: string
  gallery_painting_1_room: string
  gallery_painting_2_label: string
  gallery_painting_2_room: string
  gallery_painting_3_label: string
  gallery_painting_3_room: string
  gallery_painting_4_label: string
  gallery_painting_4_room: string
  gallery_painting_5_label: string
  gallery_painting_5_room: string
  gallery_painting_6_label: string
  gallery_painting_6_room: string
  gallery_painting_7_label: string
  gallery_painting_7_room: string
}
