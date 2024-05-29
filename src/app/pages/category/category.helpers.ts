import { PRODUCTS_CATEGORIES_IDS, ProductsCategories } from 'globalConsts/api.const';
import { Anchor } from 'globalTypes/elements';
import {
  getDiscountPercent,
  getNavLink,
  getProductDescription,
  getProductDiscount,
  getProductImages,
  getProductName,
  getProductPath,
  getProductPrice,
} from 'pages/pageWrapper.helpers';
import { state } from 'pages/pageWrapper.state';
import productsStyles from 'pages/shared/styles/products.module.scss';
import { div, h3, img } from 'shared/tags/tags.component';

import styles from './category.module.scss';

export function getProducts(category: ProductsCategories): Anchor[] {
  return state.products.reduce<Anchor[]>((products, { id, masterData: { current } }) => {
    if (
      !current.categories.find(
        (categoryRef) => categoryRef.id === PRODUCTS_CATEGORIES_IDS[category],
      )
    ) {
      return products;
    }

    const price = getProductPrice(current);
    const firstImage = getProductImages(current)?.[0];

    if (!price || !firstImage) return products;

    const discount = getProductDiscount(current);

    const cardPrices = div(
      { className: styles.cardPrices },
      div({ text: `${discount ?? price} BYN` }),
    );

    const productCard = getNavLink(
      '',
      getProductPath(category, id),
      styles.productCard,
      img({ className: styles.cardImg, src: firstImage.url, alt: 'product-card-img' }),
      h3(getProductName(current), styles.cardName),
      div({ className: styles.cardDescription, text: getProductDescription(current) }),
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

    products.push(productCard);

    return products;
  }, []);
}
