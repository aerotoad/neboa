
export type Document<T> = T & {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
