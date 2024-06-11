import { Div } from 'globalTypes/elements.type';
import { centToDollar } from 'pages/cart/cart.helpers';
import cartStyles from 'pages/cart/cart.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, img } from 'shared/tags/tags.component';

import styles from './cartItem.module.scss';
import { CartItemProps } from './cartItem.types';

export class CartItem extends BaseComponent {
  private readonly priceWrapper: Div;

  private readonly quantity: Div;

  private readonly subtotal: Div;

  public readonly id: string;

  constructor(props: CartItemProps) {
    super({ className: cartStyles.cartItem });
    this.id = props.id;

    this.priceWrapper = div(
      { className: styles.priceWrapper },
      div({ className: styles.originPrice, text: centToDollar(props.originPricePerOne) }),
      div({ className: styles.promoPrice, text: centToDollar(props.promoPricePerOne) }),
    );

    this.quantity = div({ className: styles.quantity, text: '1' });
    this.subtotal = div({
      className: styles.subtotal,
      text: `Subtotal: ${centToDollar(props.subtotal)}`,
    });

    const quantityContent = div(
      { className: styles.quantityContent },
      button({
        className: styles.quantityButton,
        text: '-',
        onclick: () => console.log('TODO MINUS'),
      }),
      this.quantity,
      button({
        className: styles.quantityButton,
        text: '+',
        onclick: () => console.log('TODO PLUS'),
      }),
    );

    this.appendChildren([
      div(
        { className: styles.cartContent },
        img({ className: styles.itemImage, src: props.imageSrc, alt: 'image' }),
        div({ className: styles.itemName, text: props.name }),
        this.priceWrapper,
        div({ className: styles.quantityWrapper }, quantityContent),
      ),
      div(
        { className: styles.itemFooter },
        button({
          className: styles.removeButton,
          text: 'Remove from Cart',
          onclick: () => console.log('TODO remove'),
        }),
        this.subtotal,
      ),
    ]);
  }

  public showPromoPrice(): void {
    this.priceWrapper.addClass(styles.promo);
  }
}
