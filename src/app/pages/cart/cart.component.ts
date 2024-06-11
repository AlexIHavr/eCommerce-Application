import { Cart } from '@commercetools/platform-sdk';
import { Div } from 'globalTypes/elements.type';
import { getCartId } from 'pages/pageWrapper.helpers';
import { catalogNavLink } from 'pages/shared/components/navLinks/navLinks.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { apiService } from 'services/api.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { button, div, img, input, label } from 'shared/tags/tags.component';

import { NO_SERVICE_AVAILABLE, NO_SUCH_CART } from './cart.consts';
import { centToDollar, makeCartClearActions, makeCartItemProps } from './cart.helpers';
import styles from './cart.module.scss';
import { CartItem } from './components/cartItem/cartItem.component';
import { ConfirmClear } from './components/confirmClear/confirmClear.component';
import emptyCartImage from './images/empty-cart.png';

export class CartComponent extends BaseComponent {
  private readonly cart: Div;

  private readonly cartTotal: Div;

  private cartData: Cart | null;

  private cartItems: CartItem[];

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

    const promocode = div(
      { className: styles.promocodeWrapper },
      label(
        { className: styles.promocodeLabel, text: 'Promocode' },
        input({
          className: styles.promocode,
          type: 'text',
          name: 'promocode',
          placeholder: 'Enter promocode',
        }),
      ),
      button({
        className: styles.promocodeButton,
        text: 'Apply',
        onclick: () => console.log('TODO Apply promocode'),
      }),
    );

    this.cartTotal = div({ className: styles.cartTotal });

    this.appendChildren([
      new SectionTitle('Cart'),
      div(
        { className: sharedStyles.container },
        this.cart,
        div(
          { className: styles.cartFooter },
          promocode,
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
    return this.cartData;
  }

  private renderCartItems(cart: Cart): void {
    this.cart.destroyChildren();
    const cartItems = makeCartItemProps(cart);

    this.cart.appendChildren(
      cartItems.map((item) => {
        const cartItem = new CartItem(item, this.removeHandler.bind(this));
        this.cartItems.push(cartItem);
        return cartItem;
      }),
    );

    this.updateCartTotal(cart.totalPrice.centAmount);
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
        this.cartData = updCart.body;
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
        console.log(actions);
        const updCart = await apiService.clearCart(cartId, version, actions);

        this.cart.destroyChildren();
        this.cartData = updCart.body;
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
}
