import { Cart } from '@commercetools/platform-sdk';
import { getProductColor } from 'pages/pageWrapper.helpers';

import { CartItemProps } from './components/cartItem/cartItem.types';

export function makeCartItemProps(data: Cart): CartItemProps[] {
  return data.lineItems.map((item) => {
    return {
      id: item.id,
      imageSrc: item.variant.images![0].url,
      name: `${item.name.en} (${getProductColor(item.variant)})`,
      originPricePerOne: item.price.discounted
        ? item.price.discounted.value.centAmount
        : item.price.value.centAmount,
      promoPricePerOne: 0, // TODO
      subtotal: item.totalPrice.centAmount,
    } as CartItemProps;
  });
}

export function centToDollar(centAmount: number): string {
  return (centAmount / 100).toLocaleString('en-US', { currency: 'USD', style: 'currency' });
}
