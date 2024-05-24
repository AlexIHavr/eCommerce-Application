import { CategoriesTypes } from 'pages/pageWrapper.consts';

export interface ProductCard {
  id: string;
  name: string;
  description: string;
  src: string;
  price: string;
  brand: string;
  color: string;
  discount?: string;
  type: CategoriesTypes;
}
