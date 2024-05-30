import { LocalizedString, ProductProjection, ProductVariant } from '@commercetools/platform-sdk';
import { ProductsCategories } from 'globalConsts/api.const';
import { Anchor } from 'globalTypes/elements';
import {
  getCurrency,
  getDiscountPercent,
  getNavLink,
  getProductColor,
  getProductDescription,
  getProductDiscount,
  getProductName,
  getProductPath,
  getProductPrice,
} from 'pages/pageWrapper.helpers';
import productsStyles from 'pages/shared/styles/products.module.scss';
import { div, h3, img } from 'shared/tags/tags.component';

import styles from './category.module.scss';

function getProductCard(
  category: ProductsCategories,
  variant: ProductVariant,
  id: string,
  name: LocalizedString,
  description?: LocalizedString,
): Anchor {
  const price = getProductPrice(variant) ?? 0;
  const discount = getProductDiscount(variant);
  const currency = getCurrency(variant);
  const color = getProductColor(variant);

  const cardPrices = div(
    { className: styles.cardPrices },
    div({ text: `${discount ?? price} ${currency}` }),
  );

  const productCard = getNavLink(
    '',
    getProductPath(category, id, color),
    styles.productCard,
    img({
      className: styles.cardImg,
      src: variant.images?.[0].url ?? '',
      alt: 'product-card-img',
    }),
    h3(getProductName(name), styles.cardName),
    div({ className: styles.cardDescription, text: getProductDescription(description) }),
    cardPrices,
  );

  if (discount) {
    cardPrices.append(
      div({
        className: productsStyles.discountPrice,
        text: `${price} ${currency}`,
      }),
    );
    productCard.append(
      div({
        className: productsStyles.discountLabel,
        text: `-${getDiscountPercent(price, discount)}%`,
      }),
    );
  }

  return productCard;
}

export function getProducts(category: ProductsCategories, products: ProductProjection[]): Anchor[] {
  return products.reduce<Anchor[]>(
    (productsCards, { id, name, description, masterVariant, variants }) => {
      if (masterVariant.isMatchingVariant) {
        productsCards.push(getProductCard(category, masterVariant, id, name, description));
      }

      productsCards.push(
        ...variants
          .filter(({ isMatchingVariant }) => isMatchingVariant)
          .map((variant) => getProductCard(category, variant, id, name, description)),
      );

      return productsCards;
    },
    [],
  );
}
