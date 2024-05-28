import { Div } from 'globalTypes/elements';
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
import { button, div, h3 } from 'shared/tags/tags.component';

import { getSlider } from './product.helpers';
import styles from './product.module.scss';

export class Product extends BaseComponent {
  private readonly sliderModal: Div;

  private readonly slider: Div;

  constructor(params: ProductParams) {
    const { name, images, price, discount, description, brand, color } = PRODUCTS_CARDS_MOCK.find(
      ({ id }) => id === params.id,
    )!;

    super(
      { className: styles.product },
      new SectionTitle(name),
      new Breadcrumbs([
        getCategoryBreadcrumbPath(params.category),
        { name, path: getProductPath(params.category, params.id) },
      ]),
    );

    this.slider = getSlider(images, styles.slider);
    this.slider.setProps({ onclick: (event) => this.showSliderModal(event) });

    if (discount) {
      const discountLabel = div({ className: productsStyles.discountLabel, text: `-${discount}%` });
      discountLabel.addClass(styles.discountLabel);

      this.slider.append(discountLabel);
    }

    this.sliderModal = div(
      { className: styles.sliderModal, onclick: (event) => this.closeSliderModal(event) },
      div(
        { className: styles.sliderInModalWrapper },
        getSlider(images),
        button({
          className: styles.closeSliderModalBtn,
          text: '❌',
          onclick: () => this.closeSliderModal(),
        }),
      ),
    );

    this.appendChildren([
      div(
        { className: sharedStyles.container },
        div(
          { className: styles.productDetails },
          this.slider,
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
            div(
              { className: styles.description },
              div({ text: description }),
              div({ text: `Brand - ${brand}` }),
              div({ text: `Color - ${color}` }),
            ),
            button({ className: styles.addToCardBtn, text: 'Add to cart' }),
          ),
        ),
      ),
      this.sliderModal,
    ]);
  }

  private showSliderModal(event: MouseEvent): void {
    if (!(event.target as HTMLImageElement).classList.contains(styles.sliderImage)) return;

    const { x, y, width, height } = this.slider.getNode().getBoundingClientRect();

    this.sliderModal.getNode().style.transformOrigin = `${x + width / 2}px ${y + height / 2}px`;
    this.sliderModal.addClass(styles.show);
  }

  private closeSliderModal(event?: MouseEvent): void {
    if (event && event.target !== this.sliderModal.getNode()) return;

    this.sliderModal.removeClass(styles.show);
  }
}
