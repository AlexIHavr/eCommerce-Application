import { LineItem } from '@commercetools/platform-sdk';
import { Div } from 'globalTypes/elements.type';
import cartStyles from 'pages/cart/cart.module.scss';
import { apiService } from 'services/api.service';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, img } from 'shared/tags/tags.component';

import styles from './cartItem.module.scss';

function centToDollar(centAmount: number | undefined): string {
  if (centAmount) {
    return (centAmount / 100).toLocaleString('en-US', { currency: 'USD', style: 'currency' });
  }
  return '-';
}

export class CartItem extends BaseComponent {
  private readonly priceWrapper: Div;

  private readonly quantity: Div;

  private readonly subtotal: Div;

  private readonly lineItemId: string;

  private lineItemQuantity: number;

  constructor(props: LineItem) {
    super({ className: cartStyles.cartItem });

    this.lineItemId = props.id;
    this.lineItemQuantity = props.quantity;

    this.priceWrapper = div(
      { className: styles.priceWrapper },
      div({
        // TODO: Add logic for origin price (if there is discount)
        className: styles.originPrice,
        text: centToDollar(props.price.value.centAmount),
      }),
      div({
        // TODO: Add logic for discount price
        className: styles.promoPrice,
        text: centToDollar(props.price.discounted?.value.centAmount),
      }),
    );

    this.quantity = div({ className: styles.quantity, text: `${props.quantity}` });
    this.subtotal = div({
      className: styles.subtotal,
      text: `Subtotal: ${centToDollar(props.totalPrice.centAmount)}`,
    });

    const quantityContent = div(
      { className: styles.quantityContent },
      button({
        className: styles.quantityButton,
        text: '-',
        onclick: () => {
          this.decreaseCartItem();
        },
      }),
      this.quantity,
      button({
        className: styles.quantityButton,
        text: '+',
        onclick: () => {
          this.increaseCartItem();
        },
      }),
    );

    this.appendChildren([
      div(
        { className: styles.cartContent },
        img({
          className: styles.itemImage,
          src: props.variant.images![0].url,
          alt: 'image',
        }),
        div({ className: styles.itemName, text: props.name.en }),
        this.priceWrapper,
        div({ className: styles.quantityWrapper }, quantityContent),
      ),
      div(
        { className: styles.itemFooter },
        button({
          className: styles.removeButton,
          text: 'Remove from Cart',
          onclick: () => {
            this.removeCartItem();
          },
        }),
        this.subtotal,
      ),
    ]);
  }

  public showPromoPrice(): void {
    this.priceWrapper.addClass(styles.promo);
  }

  private removeCartItem(): void {
    apiService.removeProductFromCart(this.lineItemId).then(() => this.destroy());
  }

  private increaseCartItem(): void {
    // TODO: disable button during request
    // TODO: recount Cart Total
    apiService.changeProductQuantity(this.lineItemQuantity + 1, this.lineItemId).then(() => {
      this.lineItemQuantity += 1;
      this.quantity.setText(`${this.lineItemQuantity}`);
    });
  }

  private decreaseCartItem(): void {
    // TODO: disable button during request
    // TODO: recount Cart Total
    if (this.lineItemQuantity > 1) {
      apiService.changeProductQuantity(this.lineItemQuantity - 1, this.lineItemId).then(() => {
        this.lineItemQuantity -= 1;
        this.quantity.setText(`${this.lineItemQuantity}`);
      });
    }
  }
}
