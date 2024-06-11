import { Cart, ClientResponse, ProductProjection } from '@commercetools/platform-sdk';
import { ProductsCategories } from 'globalConsts/api.const';
import { Button, Div } from 'globalTypes/elements.type';
import {
  getCartId,
  getCategoryBreadcrumbPath,
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
  isLogined,
} from 'pages/pageWrapper.helpers';
import { Breadcrumbs } from 'pages/shared/components/breadcrumbs/breadcrumbs.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import productsStyles from 'pages/shared/styles/products.module.scss';
import { apiService } from 'services/api.service';
import { LocalStorageService } from 'services/localStorage.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { button, div, h3 } from 'shared/tags/tags.component';

import { getSlider } from './product.helpers';
import styles from './product.module.scss';

export class Product extends BaseComponent {
  private readonly sliderModal: Div;

  private readonly slider: Div;

  private readonly addToCard: Button;

  private readonly removeFromCart: Button;

  private readonly sku?: string;

  private lineItemId?: string;

  constructor(category: ProductsCategories, product: ProductProjection) {
    const { slug, name, description, masterVariant, variants } = product;

    const currentVariant = masterVariant.isMatchingVariant
      ? masterVariant
      : variants.find(({ isMatchingVariant }) => isMatchingVariant) ?? masterVariant;

    const title = getProductName(name);
    const color = getProductColor(currentVariant);
    const price = getProductPrice(currentVariant);
    const discount = getProductDiscount(currentVariant);

    super(
      { className: styles.product },
      new SectionTitle(title),
      new Breadcrumbs([
        getCategoryBreadcrumbPath(category),
        { name: `${title} (${color})`, path: getProductPath(category, slug, color) },
      ]),
    );

    this.slider = getSlider(currentVariant.images, styles.slider);
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
        getSlider(currentVariant.images),
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

        const colorLink = getNavLink('', getProductPath(category, slug, colorValue), styles.color);

        if (colorValue) {
          colorLink.getNode().style.backgroundColor = colorValue;
        }

        if (color === colorValue) {
          colorLink.addClass(styles.active);
        }

        return colorLink;
      }),
    );

    this.sku = currentVariant.sku;

    this.addToCard = button({
      className: styles.addToCardBtn,
      text: 'Add to cart',
      onclick: () => this.addToCartHandler(),
    });

    this.removeFromCart = button({
      className: styles.removeFromCardBtn,
      text: 'Remove from cart',
      onclick: () => this.removeFromCartHandler(),
    });

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
              div({ text: getPriceWithCurrency(discount ?? price) }),
              div({
                className: productsStyles.discountPrice,
                text: discount ? getPriceWithCurrency(price) : '',
              }),
            ),
            div({ className: styles.description, text: getProductDescription(description) }),
            div(
              { className: styles.brand, text: 'Brand' },
              div({ className: styles.brandName, text: getProductBrand(currentVariant) }),
            ),
            div({ className: styles.colorsSelect }, div({ text: 'Color' }), colors),
            this.addToCard,
            this.removeFromCart,
          ),
        ),
      ),
      this.sliderModal,
    ]);

    this.setCartButtonsVisibility();
  }

  private async setCartButtonsVisibility(): Promise<void> {
    const cartId = getCartId();
    let isProductInCart: boolean = Boolean(cartId);

    if (cartId) {
      const cart = await apiService.getCart(cartId);
      const product = cart.body.lineItems.find(({ variant }) => variant.sku === this.sku);

      isProductInCart = Boolean(product);

      this.lineItemId = product?.id;
    }

    this.addToCard.setProps({ disabled: isProductInCart });
    this.removeFromCart.setProps({ disabled: !isProductInCart });
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

  private async addToCartHandler(): Promise<void> {
    if (!this.sku) return;

    const cartId = getCartId();

    loader.open();

    try {
      if (cartId) {
        await apiService.addProductToCart(cartId, this.sku);
      } else {
        let cart: ClientResponse<Cart>;

        if (isLogined()) {
          cart = await apiService.createCustomerCart();
        } else {
          cart = await apiService.createAnonymousCart(crypto.randomUUID());
        }

        LocalStorageService.saveData('cartId', cart.body.id);

        await apiService.addProductToCart(cart.body.id, this.sku);
      }

      await this.setCartButtonsVisibility();
      alertModal.showAlert('success', 'The product has been added to Cart');
    } catch (error) {
      alertModal.showAlert('error', (error as Error).message);
    } finally {
      loader.close();
    }
  }

  private removeFromCartHandler(): void {
    const cartId = getCartId();

    if (cartId && this.lineItemId) {
      loader.open();

      apiService
        .removeProductFromCart(cartId, this.lineItemId)
        .then(() => {
          this.setCartButtonsVisibility();
          alertModal.showAlert('success', 'The product has been removed from Cart');
        })
        .catch((error) => {
          alertModal.showAlert('error', (error as Error).message);
        })
        .finally(() => {
          loader.close();
        });
    }
  }
}
