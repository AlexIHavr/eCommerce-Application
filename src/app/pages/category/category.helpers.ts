import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductsCategories } from 'globalConsts/api.const';
import { Anchor } from 'globalTypes/elements';
import {
  getDiscountPercent,
  getNavLink,
  getProductDescription,
  getProductDiscount,
  getProductName,
  getProductPath,
  getProductPrice,
} from 'pages/pageWrapper.helpers';
import productsStyles from 'pages/shared/styles/products.module.scss';
import { div, h3, img } from 'shared/tags/tags.component';

import styles from './category.module.scss';

export function getProducts(category: ProductsCategories, products: ProductProjection[]): Anchor[] {
  return products.map(({ id, name, description, masterVariant }) => {
    const price = getProductPrice(masterVariant) ?? 0;
    const discount = getProductDiscount(masterVariant);

    const cardPrices = div(
      { className: styles.cardPrices },
      div({ text: `${discount ?? price} BYN` }),
    );

    const productCard = getNavLink(
      '',
      getProductPath(category, id),
      styles.productCard,
      img({
        className: styles.cardImg,
        src: masterVariant.images?.[0].url ?? '',
        alt: 'product-card-img',
      }),
      h3(getProductName(name), styles.cardName),
      div({ className: styles.cardDescription, text: getProductDescription(description) }),
      cardPrices,
    );

    if (discount) {
      cardPrices.append(div({ className: productsStyles.discountPrice, text: `${price} BYN` }));
      productCard.append(
        div({
          className: productsStyles.discountLabel,
          text: `-${getDiscountPercent(price, discount)}%`,
        }),
      );
    }

    return productCard;
  });
}
