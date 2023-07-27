
export interface LookupOptions {
  from: string;
  localField: string;
  foreignField: string;
  as: string;
  limit?: number;
  skip?: number;
  sort?: SortOptions;
}

export interface SortOptions {
  [key: string]: 'asc' | 'desc';
}
