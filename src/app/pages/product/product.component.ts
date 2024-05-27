import { PRODUCTS_CARDS_MOCK } from 'pages/category/category.consts';
import { getCategoryBreadcrumbPath, getProductPath } from 'pages/pageWrapper.helpers';
import { ProductParams } from 'pages/pageWrapper.types';
import { Breadcrumbs } from 'pages/shared/components/breadcrumbs/breadcrumbs.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { Slider } from 'shared/slider/slider.component';
import { div, img } from 'shared/tags/tags.component';

import styles from './product.module.scss';

export class Product extends BaseComponent {
  constructor(params: ProductParams) {
    const product = PRODUCTS_CARDS_MOCK.find(({ id }) => id === params.id)!;

    super(
      { className: styles.product },
      new SectionTitle(product.name),
      new Breadcrumbs([
        getCategoryBreadcrumbPath(params.category),
        { name: product.name, path: getProductPath(params.category, params.id) },
      ]),
      div(
        { className: sharedStyles.container },
        div(
          { className: styles.productDetails },
          div(
            { className: styles.slider },
            Slider.getSliderWrapper(
              ...product.images.map((image) =>
                img({ className: styles.sliderImage, src: image, alt: `${image}-image` }),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
