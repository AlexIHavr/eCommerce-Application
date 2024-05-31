import { CategoriesTypes } from 'pages/pageWrapper.consts';

export interface ProductCardMock {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: string;
  brand: string;
  color: string;
  discount?: string;
  type: CategoriesTypes;
}
