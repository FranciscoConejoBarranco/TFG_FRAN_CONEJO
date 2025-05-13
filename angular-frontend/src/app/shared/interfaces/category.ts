import { Book } from "./book";


export interface Category {
  name: string;
  books: Book[];
}