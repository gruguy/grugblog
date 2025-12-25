export interface Article {
  id: number
  title: string
  content: string
  summary?: string
  cover?: string
  categoryId: number
  category?: Category
  tags?: Tag[]
  views: number
  likes?: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  articleCount?: number;
}

export interface Tag {
  id: number
  name: string
}

export interface Music {
  id: number
  name: string
  artist: string
  cover: string
  url: string
  duration?: number
  playCount: number
  createdAt: string
}

export interface Image {
  id: number
  name: string
  description?: string
  url: string
  thumbnail?: string
  categoryId?: number
  category?: Category
  createdAt: string
}

export interface Video {
  id: number
  title: string
  description?: string
  url: string
  cover?: string
  duration?: number
  playCount: number
  createdAt: string
}

