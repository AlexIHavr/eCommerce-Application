import { Anchor } from 'globalTypes/elements';
import { CategoriesTypes } from 'pages/pageWrapper.consts';
import { getNavLink, getProductPath } from 'pages/pageWrapper.helpers';
import { div, h3, img } from 'shared/tags/tags.component';

import { PRODUCTS_CARDS_MOCK } from './category.consts';
import styles from './category.module.scss';

const CURRENCY = 'BYN';

export function getProducts(category: CategoriesTypes): Anchor[] {
  return PRODUCTS_CARDS_MOCK.filter(({ type }) => type === category).map(
    ({ id, name, images, price, discount, description }) => {
      const priceWithDiscount = discount
        ? `${Number(price) - (Number(price) * Number(discount)) / 100} ${CURRENCY}`
        : `${price} ${CURRENCY}`;

      const prices = div({ className: styles.cardPrices }, div({ text: priceWithDiscount }));

      const productCard = getNavLink(
        '',
        getProductPath(category, id),
        styles.productCard,
        img({ className: styles.cardImg, src: images[0], alt: 'product-card-img' }),
        h3(name, styles.cardName),
        div({ className: styles.cardDescription, text: description }),
        prices,
      );

      if (discount) {
        prices.append(div({ className: styles.discountPrice, text: `${price} ${CURRENCY}` }));
        productCard.append(div({ className: styles.discountLabel, text: `-${discount}%` }));
      }

      return productCard;
    },
  );
}
