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
  name: string | null
  title: string
  slug: string
  description?: string
  location?: string | null
  alt?: string | null
  cover_url: string | null
  created_at: string
  order: number
  visibility?: string
  photos?: Photo[]
}

// Normalized photo used in the gallery and lightbox — works with both Supabase and hardcoded data
export type LightboxPhoto = {
  id: string
  url: string
  alt: string
  width?: number
  height?: number
  scale?: number
  canvas_x?: number | null
  canvas_y?: number | null
  canvas_w?: number | null
  canvas_h?: number | null
  meta?: { title: string; publication: string }
}

// Slim album shape used in carousel and portfolio grid
export type AlbumSlim = {
  id: string   // slug for Supabase, id for hardcoded
  label: string
  coverUrl: string
  photoCount: number
  coverAspectRatio?: number  // width / height of cover photo
}
