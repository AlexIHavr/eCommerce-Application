import { Cart } from '@commercetools/platform-sdk';
import { Div } from 'globalTypes/elements.type';
import { catalogNavLink } from 'pages/shared/components/navLinks/navLinks.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { apiService } from 'services/api.service';
import { LocalStorageService } from 'services/localStorage.service';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { button, div, img, input, label } from 'shared/tags/tags.component';

import { centToDollar, makeCartItemProps } from './cart.helpers';
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

    this.cartTotal = div({ className: styles.cartTotal, text: 'Cart Total: $10 000.00' });

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
            onclick: () => this.append(new ConfirmClear()),
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
        if (data?.lineItems) this.renderCartItems(data);
      })
      .finally(() => loader.close());
  }

  private async initCart(): Promise<Cart | null> {
    // My Cart ID: "866f3ac5-7489-4e93-96d0-ba9707f5ea38"
    const anonymousCartId = LocalStorageService.getData('anonymousCartId');
    const customerCartId = LocalStorageService.getData('customerCartId');

    if (anonymousCartId) {
      const data = await apiService.getCart(anonymousCartId);
      this.cartData = data.body;
    } else if (customerCartId) {
      const data = await apiService.getCart(customerCartId);
      this.cartData = data.body;
    }

    return this.cartData;
  }

  private renderCartItems(cart: Cart): void {
    this.cart.destroyChildren();
    const cartItems = makeCartItemProps(cart);

    this.cart.appendChildren(
      cartItems.map((item) => {
        const cartItem = new CartItem(item);
        this.cartItems.push(cartItem);
        return cartItem;
      }),
    );

    this.updateCartTotal(cart.totalPrice.centAmount);
  }

  private updateCartTotal(price: number): void {
    this.cartTotal.setText(`Cart Total: ${centToDollar(price)}`);
  }
}
