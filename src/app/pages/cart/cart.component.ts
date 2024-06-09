import { LineItem } from '@commercetools/platform-sdk';
import { Div } from 'globalTypes/elements.type';
import { catalogNavLink } from 'pages/shared/components/navLinks/navLinks.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { apiService } from 'services/api.service';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, img, input, label } from 'shared/tags/tags.component';

import styles from './cart.module.scss';
import { CartItem } from './components/cartItem/cartItem.component';
import { ConfirmClear } from './components/confirmClear/confirmClear.component';
import emptyCartImage from './images/empty-cart.png';

export class CartComponent extends BaseComponent {
  private readonly cart: Div;

  private readonly cartTotal: Div;

  constructor() {
    super({ className: styles.cartPage });
    this.cart = div({ className: styles.cart });
    this.renderCart();

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

    this.cartTotal = div({ className: styles.cartTotal, text: 'Cart Total: $0' });

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
  }

  private async renderCart(): Promise<void> {
    const cart = await apiService.getCart();
    if (cart) {
      this.renderCartItems(cart.body.lineItems);
      this.cartTotal.setText(
        `Cart Total: ${(cart.body.totalPrice.centAmount / 100).toLocaleString('en-US', { currency: 'USD', style: 'currency' })}`,
      );
    }
  }

  private renderCartItems(lineItems: LineItem[]): void {
    lineItems.forEach((lineItem) => this.cart.appendChildren([new CartItem(lineItem)]));
  }
}
