import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductsCategories } from 'globalConsts/api.const';
import { Div } from 'globalTypes/elements';
import {
  getCategoryBreadcrumbPath,
  getCurrency,
  getDiscountPercent,
  getNavLink,
  getProductBrand,
  getProductColor,
  getProductDescription,
  getProductDiscount,
  getProductName,
  getProductPath,
  getProductPrice,
} from 'pages/pageWrapper.helpers';
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

  constructor(category: ProductsCategories, product: ProductProjection) {
    const { id, name, description, masterVariant, variants } = product;

    const currentVariant = masterVariant.isMatchingVariant
      ? masterVariant
      : variants.find(({ isMatchingVariant }) => isMatchingVariant) ?? masterVariant;

    const title = getProductName(name);
    const color = getProductColor(currentVariant);

    super(
      { className: styles.product },
      new SectionTitle(title),
      new Breadcrumbs([
        getCategoryBreadcrumbPath(category),
        { name: title, path: getProductPath(category, id, color) },
      ]),
    );

    const { images } = currentVariant;
    const price = getProductPrice(currentVariant);
    const discount = getProductDiscount(currentVariant);
    const currency = getCurrency(currentVariant);

    this.slider = getSlider(images, styles.slider);
    this.slider.setProps({ onclick: (event) => this.showSliderModal(event) });

    if (price && discount) {
      const discountLabel = div({
        className: productsStyles.discountLabel,
        text: `-${getDiscountPercent(price, discount)}%`,
      });
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

    const colors = div(
      { className: styles.colors },
      ...[masterVariant, ...variants].map((variant) => {
        const colorValue = getProductColor(variant);

        const colorLink = getNavLink('', getProductPath(category, id, colorValue), styles.color);

        if (colorValue) {
          colorLink.getNode().style.backgroundColor = colorValue;
        }

        if (color === colorValue) {
          colorLink.addClass(styles.active);
        }

        return colorLink;
      }),
    );

    this.appendChildren([
      div(
        { className: sharedStyles.container },
        div(
          { className: styles.productDetails },
          this.slider,
          div(
            { className: styles.details },
            h3(title),
            div(
              { className: styles.prices },
              div({ text: `${discount ?? price} ${currency}` }),
              div({
                className: productsStyles.discountPrice,
                text: discount ? `${price} ${currency}` : '',
              }),
            ),
            div({ className: styles.description, text: getProductDescription(description) }),
            div(
              { className: styles.brand, text: 'Brand' },
              div({ className: styles.brandName, text: getProductBrand(currentVariant) }),
            ),
            div({ className: styles.colorsSelect }, div({ text: 'Color' }), colors),
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
