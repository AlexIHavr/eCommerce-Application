import { FormFieldsProps } from 'pages/shared/components/formField/formField.types';

export const PRODUCTS_FILTERS_PROPS = {
  priceFrom: {
    name: 'price-from',
    type: 'number',
    placeholder: 'From',
    pattern: '^[1-9][0-9]*$',
  },
  priceTo: {
    name: 'price-to',
    type: 'number',
    placeholder: 'To',
    pattern: '^[1-9][0-9]*$',
  },
  search: {
    name: 'search',
    type: 'search',
    placeholder: 'Search',
  },
} as const satisfies FormFieldsProps;

export const PRODUCTS_OPTIONS = {
  size: ['S', 'M', 'L'],
  color: ['Black', 'Red', 'Yellow', 'Green', 'White'],
} as const satisfies Record<string, string[]>;
