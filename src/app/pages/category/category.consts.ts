import { ProductCard } from './category.interfaces';
import sofaImage from './images/sofaImg.jpg';

export const PRODUCTS_CARDS: ProductCard[] = [
  {
    name: 'Cozy sofa',
    description: 'This is the first card',
    src: sofaImage,
    price: '1500',
    discount: '10',
    brand: 'Brand 1',
    color: 'white',
  },
];
