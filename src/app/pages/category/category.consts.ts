import { ProductsCategories } from 'globalConsts/api.const';

import { ProductCardMock } from './category.interfaces';
import sofaImage from './images/sofaImg.jpg';

export const PRODUCTS_CARDS_MOCK: ProductCardMock[] = [
  {
    id: '1',
    name: 'Cozy sofa 1',
    description: 'This is the first card',
    images: [sofaImage, sofaImage, sofaImage],
    price: '1500',
    discount: '10',
    brand: 'Brand 1',
    color: 'black',
    type: ProductsCategories.CHAIRS,
  },
  {
    id: '2',
    name: 'Cozy sofa 2',
    description: 'This is the second card',
    images: [sofaImage],
    price: '1600',
    discount: '20',
    brand: 'Brand 1',
    color: 'black',
    type: ProductsCategories.CHAIRS,
  },
  {
    id: '3',
    name: 'Cozy sofa 3',
    description: 'This is the third card',
    images: [sofaImage],
    price: '1300',
    discount: '25',
    brand: 'Brand 2',
    color: 'black',
    type: ProductsCategories.CHAIRS,
  },
  {
    id: '4',
    name: 'Cozy sofa 4',
    description: 'This is the four card',
    images: [sofaImage],
    price: '1200',
    brand: 'Brand 3',
    color: 'black',
    type: ProductsCategories.CHAIRS,
  },
  {
    id: '5',
    name: 'Cozy sofa 5',
    description: 'This is the five card',
    images: [sofaImage],
    price: '1700',
    discount: '30',
    brand: 'Brand 2',
    color: 'black',
    type: ProductsCategories.SOFAS,
  },
  {
    id: '6',
    name: 'Cozy sofa 6',
    description: 'This is the six card',
    images: [sofaImage],
    price: '1800',
    discount: '5',
    brand: 'Brand 1',
    color: 'black',
    type: ProductsCategories.SOFAS,
  },
  {
    id: '7',
    name: 'Cozy sofa 7',
    description: 'This is the seven card',
    images: [sofaImage],
    price: '1900',
    brand: 'Brand 2',
    color: 'black',
    type: ProductsCategories.BEDS,
  },
  {
    id: '8',
    name: 'Cozy sofa 8',
    description: 'This is the eight card',
    images: [sofaImage],
    price: '2000',
    discount: '50',
    brand: 'Brand 3',
    color: 'black',
    type: ProductsCategories.BEDS,
  },
];
