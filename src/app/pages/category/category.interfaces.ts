import { ProductsCategories } from 'globalConsts/api.const';

export interface ProductCardMock {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: string;
  brand: string;
  color: string;
  discount?: string;
  type: ProductsCategories;
}
