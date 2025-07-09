// src/types/categoryTypes.ts

export interface Category {
  id: string
  categoryName: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  isDeleted: boolean
}

export interface PagedResponse<T> {
  isSuccess: boolean
  message: string
  data: {
    items: T[]
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }
  errors: any[]
}
