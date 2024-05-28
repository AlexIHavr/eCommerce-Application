import { PRODUCTS_CARDS_MOCK } from 'pages/category/category.consts';
import {
  getCategoryBreadcrumbPath,
  getDiscountPrice,
  getProductPath,
} from 'pages/pageWrapper.helpers';
import { ProductParams } from 'pages/pageWrapper.types';
import { Breadcrumbs } from 'pages/shared/components/breadcrumbs/breadcrumbs.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import productsStyles from 'pages/shared/styles/products.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { Slider } from 'shared/slider/slider.component';
import { div, h3, img } from 'shared/tags/tags.component';

import styles from './product.module.scss';

export class Product extends BaseComponent {
  constructor(params: ProductParams) {
    const { name, images, price, discount, description, brand, color } = PRODUCTS_CARDS_MOCK.find(
      ({ id }) => id === params.id,
    )!;

    const slider = div(
      { className: styles.slider },
      Slider.getSliderWrapper(
        ...images.map((image) =>
          img({ className: styles.sliderImage, src: image, alt: `${image}-image` }),
        ),
      ),
    );

    if (discount) {
      const discountLabel = div({ className: productsStyles.discountLabel, text: `-${discount}%` });
      discountLabel.addClass(styles.discountLabel);

      slider.append(discountLabel);
    }

    super(
      { className: styles.product },
      new SectionTitle(name),
      new Breadcrumbs([
        getCategoryBreadcrumbPath(params.category),
        { name, path: getProductPath(params.category, params.id) },
      ]),
      div(
        { className: sharedStyles.container },
        div(
          { className: styles.productDetails },
          slider,
          div(
            { className: styles.details },
            h3(name),
            div(
              { className: styles.prices },
              div({ text: getDiscountPrice(price, discount) }),
              div({
                className: productsStyles.discountPrice,
                text: discount ? `${price} BYN` : '',
              }),
            ),
            div({ text: description }),
            div({ text: `Brand - ${brand}` }),
            div({ text: `Color - ${color}` }),
          ),
        ),
      ),
    );
  }
}
