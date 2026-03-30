import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  project_type: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>

export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  subtitle: z.string().optional(),
  category: z.enum(['Residential', 'Commercial', 'Cultural', 'Hospitality', 'Public']),
  location: z.string().min(2, 'Location is required'),
  year: z.number().min(1900).max(2100),
  description: z.string().optional(),
  story: z.string().optional(),
  cover_url: z.string().optional(),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sort_order: z.number().default(0),
})

export type ProjectFormData = z.input<typeof projectSchema>

export const settingsSchema = z.object({
  hero_tagline: z.string(),
  hero_sub: z.string(),
  projects_count: z.string(),
  awards_count: z.string(),
  countries_count: z.string(),
  years_count: z.string(),
  studio_email: z.string().email(),
  studio_phone: z.string().optional(),
  studio_address: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
})
