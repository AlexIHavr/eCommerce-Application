import { FormFieldsProps } from 'pages/shared/components/formField/formField.types';

export const PRODUCT_FILTER_PROPS = {
  priceFrom: {
    name: 'price-from',
    type: 'number',
    placeholder: 'From',
    pattern: '^[1-9][0-9]*$',
  },
  priceTo: {
    name: 'price-from',
    type: 'number',
    placeholder: 'To',
    pattern: '^[1-9][0-9]*$',
  },
  search: {
    name: 'search',
    type: 'text',
    placeholder: 'Search',
  },
} as const satisfies FormFieldsProps;
