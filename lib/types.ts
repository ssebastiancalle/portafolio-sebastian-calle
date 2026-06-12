export type Photo = {
  id: string
  album_id: string
  url: string
  alt: string
  order: number
  taken_at?: string
  lat?: number
  lng?: number
  altitude?: number
  camera_make?: string
  camera_model?: string
  width?: number
  height?: number
  exif_raw?: Record<string, unknown>
}

export type Album = {
  id: string
  name: string
  slug: string
  description?: string
  cover_url: string
  created_at: string
  order: number
  photos?: Photo[]
}

// Normalized photo used in the gallery and lightbox — works with both Supabase and hardcoded data
export type LightboxPhoto = {
  id: string
  url: string
  alt: string
  width?: number
  height?: number
  meta?: { title: string; publication: string }
}

// Slim album shape used in carousel and portfolio grid
export type AlbumSlim = {
  id: string   // slug for Supabase, id for hardcoded
  label: string
  coverUrl: string
  photoCount: number
}
