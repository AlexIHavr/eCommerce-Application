import { Cart } from '@commercetools/platform-sdk';
import { Button, Div, Form, Input } from 'globalTypes/elements.type';
import { getCartId } from 'pages/pageWrapper.helpers';
import { catalogNavLink } from 'pages/shared/components/navLinks/navLinks.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { apiService } from 'services/api.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { button, div, form, img, input, label } from 'shared/tags/tags.component';

import {
  NO_ACTIVE_PROMOCODE,
  NO_SERVICE_AVAILABLE,
  NO_SUCH_CART,
  NO_SUCH_PROMOCODE,
} from './cart.consts';
import { centToDollar, makeCartClearActions, makeCartItemProps } from './cart.helpers';
import styles from './cart.module.scss';
import { CartItem } from './components/cartItem/cartItem.component';
import { ConfirmClear } from './components/confirmClear/confirmClear.component';
import emptyCartImage from './images/empty-cart.png';

export class CartComponent extends BaseComponent {
  private readonly cart: Div;

  private readonly cartTotal: Div;

  private readonly promocodeWrapper: Form;

  private readonly promocodeInput: Input;

  private readonly promocodeText: Div;

  private readonly applyPromoBtn: Button;

  private readonly removePromoBtn: Button;

  private cartData: Cart | null;

  private cartItems: CartItem[];

  private currentPromocode: string | undefined;

  constructor() {
    super({ className: styles.cartPage });
    this.cartData = null;
    this.cartItems = [];

    this.cart = div(
      { className: styles.cart },
      div({
        className: `${styles.cartItem} ${styles.dummy}`,
      }),
    );

    this.promocodeInput = input({
      className: styles.promocode,
      type: 'text',
      name: 'promocode',
      autocomplete: 'off',
      placeholder: 'Enter promocode',
      oninput: () => {
        if (this.promocodeInput.getNode().value.trim().length) {
          this.applyPromoBtn.removeAttribute('disabled');
        } else {
          this.applyPromoBtn.setAttribute('disabled', 'true');
        }
      },
    });

    this.applyPromoBtn = button({
      className: styles.promocodeButton,
      text: 'Apply',
      type: 'submit',
      disabled: true,
      onclick: (e) => {
        e.preventDefault();
        const promocode = this.promocodeInput.getNode().value.toUpperCase();
        if (promocode) this.applyPromocode(promocode);
      },
    });

    this.removePromoBtn = button({
      className: styles.promocodeRemoveButton,
      text: 'Remove',
      type: 'button',
      onclick: () => this.removePromocode(),
    });

    this.promocodeText = div({ className: styles.promocodeText });

    this.promocodeWrapper = form(
      { className: styles.promocodeWrapper },
      label(
        { className: styles.promocodeLabel, text: 'Promocode' },
        this.promocodeInput,
        this.promocodeText,
      ),
      this.applyPromoBtn,
      this.removePromoBtn,
    );

    this.cartTotal = div({ className: styles.cartTotal });

    this.appendChildren([
      new SectionTitle('Cart'),
      div(
        { className: sharedStyles.container },
        this.cart,
        div(
          { className: styles.cartFooter },
          this.promocodeWrapper,
          this.cartTotal,
          button({
            className: styles.clearCartBtn,
            text: 'Clear Shopping Cart',
            onclick: () => this.append(new ConfirmClear(this.clearCart.bind(this))),
          }),
        ),
        div(
          { className: styles.emptyCart },
          div({ className: styles.emptyText, text: 'Your Cart Is Currently Empty' }),
          img({
            className: styles.emptyImage,
            src: emptyCartImage,
            alt: 'empty-cart-image',
          }),
          div(
            { className: styles.emptyText, text: 'Find something in ' },
            catalogNavLink(styles.emptyLink),
          ),
        ),
      ),
    ]);

    loader.open();
    this.initCart()
      .then((data) => {
        if (data?.lineItems) {
          this.renderCartItems(data);
          if (data.discountCodes.length) {
            this.renderPromocode(data.discountCodes[0].discountCode.id);
          }
        } else {
          this.cart.destroyChildren();
        }
      })
      .finally(() => loader.close());
  }

  private async initCart(): Promise<Cart | null> {
    const cartId = getCartId();
    if (!cartId) return null;

    const data = await apiService.getCart(cartId);
    this.cartData = data.body;
    return data.body;
  }

  private renderCartItems(cart: Cart): void {
    this.cart.destroyChildren();
    const cartItems = makeCartItemProps(cart);

    this.cart.appendChildren(
      cartItems.map((item) => {
        const cartItem = new CartItem(
          item,
          this.removeHandler.bind(this),
          this.changeQuantity.bind(this),
        );
        this.cartItems.push(cartItem);
        return cartItem;
      }),
    );

    this.updateCartTotal(cart.totalPrice.centAmount);
  }

  private renderPromocode(promocodeId: string): void {
    this.promocodeWrapper.addClass(styles.active);
    this.currentPromocode = promocodeId;

    apiService.getPromocode(promocodeId).then((discount) => {
      this.promocodeText.setText(discount.body.code);
    });
  }

  private updateCartTotal(price: number): void {
    this.cartTotal.setText(`Cart Total: ${centToDollar(price)}`);
  }

  private deleteItem(id: string): void {
    const delItem = this.cartItems.find((item) => item.id === id);
    const delItemIndex = this.cartItems.findIndex((item) => item.id === id);
    this.cartItems.splice(delItemIndex, 1);
    delItem?.destroy();
  }

  private async removeHandler(lineItemId: string): Promise<void> {
    const cartId = getCartId();

    if (cartId) {
      try {
        loader.open();
        const cart = await apiService.getCart(cartId);

        const { version } = cart.body;
        const updCart = await apiService.removeProductFromCart(cartId, version, lineItemId);

        this.deleteItem(lineItemId);
        this.updateCartTotal(updCart.body.totalPrice.centAmount);
      } catch (error) {
        alertModal.showAlert('error', NO_SERVICE_AVAILABLE);
      } finally {
        loader.close();
      }
    } else {
      this.cart.destroyChildren();
      alertModal.showAlert('error', NO_SUCH_CART);
    }
  }

  private async clearCart(): Promise<void> {
    const cartId = getCartId();

    if (cartId) {
      try {
        loader.open();
        const cart = await apiService.getCart(cartId);

        const { version } = cart.body;
        const actions = makeCartClearActions(this.cartItems);
        await apiService.clearCart(cartId, version, actions);

        this.cart.destroyChildren();
        this.cartItems = [];
      } catch (error) {
        alertModal.showAlert('error', NO_SERVICE_AVAILABLE);
      } finally {
        loader.close();
      }
    } else {
      this.cart.destroyChildren();
      alertModal.showAlert('error', NO_SUCH_CART);
    }
  }

  private async changeQuantity(id: string, quantity: number): Promise<void> {
    const cartId = getCartId();

    if (cartId) {
      try {
        loader.open();
        const cart = await apiService.getCart(cartId);

        const { version } = cart.body;
        const updCart = await apiService.changeProductQuantity(cartId, version, id, quantity);

        const updLineItem = updCart.body.lineItems.find((item) => item.id === id);
        const currentLineItem = this.cartItems.find((item) => item.id === id);

        if (updLineItem) {
          currentLineItem?.updateQuantity(
            updLineItem?.quantity,
            updLineItem?.totalPrice.centAmount,
          );
        }

        this.updateCartTotal(updCart.body.totalPrice.centAmount);
        if (quantity === 0) this.deleteItem(id);
      } catch (error) {
        alertModal.showAlert('error', NO_SERVICE_AVAILABLE);
      } finally {
        loader.close();
      }
    } else {
      this.cart.destroyChildren();
      alertModal.showAlert('error', NO_SUCH_CART);
    }
  }

  private async applyPromocode(promocode: string): Promise<void> {
    const cartId = getCartId();

    if (cartId) {
      try {
        loader.open();
        const cart = await apiService.getCart(cartId);

        const { version } = cart.body;
        apiService
          .usePromocode(cartId, version, promocode)
          .then((updCart) => {
            updCart.body.lineItems.forEach((item) => {
              if (item.discountedPricePerQuantity.length) {
                const promoprice =
                  item.discountedPricePerQuantity[0].discountedPrice.value.centAmount;
                const lineItemForUpd = this.cartItems.find((lineItem) => lineItem.id === item.id);

                lineItemForUpd?.showPromoPrice(promoprice);
                lineItemForUpd?.updateSubtotal(item.totalPrice.centAmount, item.quantity);
              }
            });

            this.currentPromocode = updCart.body.discountCodes[0].discountCode.id;
            this.promocodeWrapper.addClass(styles.active);
            this.promocodeText.setText(promocode);
            this.promocodeInput.getNode().value = '';
            this.applyPromoBtn.setAttribute('disabled', 'true');
            this.updateCartTotal(updCart.body.totalPrice.centAmount);
          })
          .catch((error) => {
            if (error.code === 400) alertModal.showAlert('error', NO_SUCH_PROMOCODE);
          });
      } catch (error) {
        alertModal.showAlert('error', NO_SERVICE_AVAILABLE);
      } finally {
        loader.close();
      }
    } else {
      this.cart.destroyChildren();
      alertModal.showAlert('error', NO_SUCH_CART);
    }
  }

  private async removePromocode(): Promise<void> {
    if (!this.currentPromocode) {
      alertModal.showAlert('attention', NO_ACTIVE_PROMOCODE);
      return;
    }

    const cartId = getCartId();
    if (cartId) {
      try {
        loader.open();
        const cart = await apiService.getCart(cartId);

        const { version } = cart.body;
        const updCart = await apiService.abortPromocode(cartId, version, this.currentPromocode);

        updCart.body.lineItems.forEach((item) => {
          const lineItemForUpd = this.cartItems.find((lineItem) => lineItem.id === item.id);

          lineItemForUpd?.hidePromoPrice();
          lineItemForUpd?.updateSubtotal(item.totalPrice.centAmount, item.quantity);
        });

        this.currentPromocode = undefined;
        this.promocodeWrapper.removeClass(styles.active);
        this.updateCartTotal(updCart.body.totalPrice.centAmount);
      } catch (error) {
        alertModal.showAlert('error', NO_SERVICE_AVAILABLE);
      } finally {
        loader.close();
      }
    } else {
      this.cart.destroyChildren();
      alertModal.showAlert('error', NO_SUCH_CART);
    }
  }
}
