export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: SortOrder;
}

export interface SearchParams extends PaginationParams {
  q?: string;
}
