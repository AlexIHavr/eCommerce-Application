import { Div } from 'globalTypes/elements';
import { div, h3, img } from 'shared/tags/tags.component';

import { PRODUCTS_CARDS } from './category.consts';
import styles from './category.module.scss';

const CURRENCY = 'BYN';

export function getProducts(): Div[] {
  return PRODUCTS_CARDS.map(({ name, src, price, discount, description }) => {
    const priceWithDiscount = discount
      ? `${Number(price) - (Number(price) * Number(discount)) / 100} ${CURRENCY}`
      : `${price} ${CURRENCY}`;

    const prices = div({ className: styles.cardPrices }, div({ text: priceWithDiscount }));

    const products = div(
      { className: styles.productCard },
      img({ className: styles.cardImg, src, alt: 'product-card-img' }),
      h3(name, styles.cardName),
      div({ className: styles.cardDescription, text: description }),
      prices,
    );

    if (discount) {
      prices.append(div({ className: styles.discountPrice, text: `${price} ${CURRENCY}` }));
      products.append(div({ className: styles.discountLabel, text: `-${discount}%` }));
    }

    return products;
  });
}
