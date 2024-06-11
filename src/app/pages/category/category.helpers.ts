import { LocalizedString, ProductProjection, ProductVariant } from '@commercetools/platform-sdk';
import { ProductsCategories } from 'globalConsts/api.const';
import { Anchor } from 'globalTypes/elements.type';
import {
  getDiscountPercent,
  getNavLink,
  getPriceWithCurrency,
  getProductBrand,
  getProductColor,
  getProductDescription,
  getProductDiscount,
  getProductName,
  getProductPath,
  getProductPrice,
} from 'pages/pageWrapper.helpers';
import { ProductCartButtons } from 'pages/shared/components/productCartButtons/productCartButtons.component';
import productsStyles from 'pages/shared/styles/products.module.scss';
import { div, h3, img } from 'shared/tags/tags.component';

import styles from './category.module.scss';

function getProductCard(
  category: ProductsCategories,
  variant: ProductVariant,
  slug: LocalizedString,
  name: LocalizedString,
  description?: LocalizedString,
): Anchor {
  const price = getProductPrice(variant) ?? 0;
  const discount = getProductDiscount(variant);
  const color = getProductColor(variant);

  const cardPrices = div(
    { className: styles.cardPrices },
    div({ text: getPriceWithCurrency(discount ?? price) }),
  );

  const productCard = getNavLink(
    '',
    getProductPath(category, slug, color),
    styles.productCard,
    img({
      className: styles.cardImg,
      src: variant.images?.[0].url ?? '',
      alt: 'product-card-img',
    }),
    h3(`${getProductName(name)} (${color})`, styles.cardName),
    h3(`${getProductBrand(variant)}`, styles.cardName),
    div({ className: styles.cardDescription, text: getProductDescription(description) }),
    cardPrices,
    div({}, new ProductCartButtons(variant.sku, true)),
  );

  if (discount) {
    cardPrices.append(
      div({
        className: productsStyles.discountPrice,
        text: getPriceWithCurrency(price),
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
    (productsCards, { slug, name, description, masterVariant, variants }) => {
      if (masterVariant.isMatchingVariant) {
        productsCards.push(getProductCard(category, masterVariant, slug, name, description));
      }

      variants
        .filter(({ isMatchingVariant }) => isMatchingVariant)
        .forEach((variant) =>
          productsCards.push(getProductCard(category, variant, slug, name, description)),
        );

      return productsCards;
    },
    [],
  );
}
