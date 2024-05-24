import { FormFieldsProps } from 'pages/shared/components/formField/formField.types';

export const PRODUCTS_FILTERS_PROPS = {
  priceFrom: {
    name: 'price-from',
    type: 'number',
    placeholder: 'From',
  },
  priceTo: {
    name: 'price-to',
    type: 'number',
    placeholder: 'To',
  },
  search: {
    name: 'search',
    type: 'text',
    placeholder: 'Search',
  },
} as const satisfies FormFieldsProps;

export const PRODUCTS_OPTIONS = {
  brand: ['Brand 1', 'Brand 2', 'Brand 3'],
  color: ['Black', 'Red', 'Yellow', 'Green', 'White'],
} as const satisfies Record<string, string[]>;
