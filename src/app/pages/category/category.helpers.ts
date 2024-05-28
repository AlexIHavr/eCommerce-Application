import { Anchor } from 'globalTypes/elements';
import { CategoriesTypes } from 'pages/pageWrapper.consts';
import { getDiscountPrice, getNavLink, getProductPath } from 'pages/pageWrapper.helpers';
import productsStyles from 'pages/shared/styles/products.module.scss';
import { div, h3, img } from 'shared/tags/tags.component';

import { PRODUCTS_CARDS_MOCK } from './category.consts';
import styles from './category.module.scss';

export function getProducts(category: CategoriesTypes): Anchor[] {
  return PRODUCTS_CARDS_MOCK.filter(({ type }) => type === category).map(
    ({ id, name, images, price, discount, description }) => {
      const prices = div(
        { className: styles.cardPrices },
        div({ text: getDiscountPrice(price, discount) }),
      );

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
        prices.append(div({ className: productsStyles.discountPrice, text: `${price} BYN` }));
        productCard.append(div({ className: productsStyles.discountLabel, text: `-${discount}%` }));
      }

      return productCard;
    },
  );
}
