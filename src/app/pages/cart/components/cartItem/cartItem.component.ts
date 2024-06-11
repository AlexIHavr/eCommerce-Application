import { Div, Input } from 'globalTypes/elements.type';
import { centToDollar } from 'pages/cart/cart.helpers';
import cartStyles from 'pages/cart/cart.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, img, input } from 'shared/tags/tags.component';

import styles from './cartItem.module.scss';
import { CartItemProps } from './cartItem.types';

export class CartItem extends BaseComponent {
  private readonly priceWrapper: Div;

  private readonly quantity: Input;

  private readonly quantityError: Div;

  private readonly subtotal: Div;

  public readonly id: string;

  constructor(props: CartItemProps, removeHandler: (id: string) => void) {
    super({ className: cartStyles.cartItem });
    this.id = props.id;

    this.priceWrapper = div(
      { className: styles.priceWrapper },
      div({ className: styles.originPrice, text: centToDollar(props.originPricePerOne) }),
      div({ className: styles.promoPrice, text: centToDollar(props.promoPricePerOne) }),
    );

    this.quantity = input({
      className: styles.quantity,
      type: 'text',
      value: '1',
      autocomplete: 'off',
      onchange: () => console.log('TODO CHANGE'),
      oninput: () => {
        this.quantity.getNode().value = this.quantity.getNode().value.replace(/\D/g, '');
      },
    });
    this.subtotal = div({
      className: styles.subtotal,
      text: `Subtotal: ${centToDollar(props.subtotal)}`,
    });

    this.quantityError = div({ className: styles.quantityError });

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
        div({ className: styles.quantityWrapper }, quantityContent, this.quantityError),
      ),
      div(
        { className: styles.itemFooter },
        button({
          className: styles.removeButton,
          text: 'Remove from Cart',
          onclick: () => removeHandler(props.id),
        }),
        this.subtotal,
      ),
    ]);
  }

  public showPromoPrice(): void {
    this.priceWrapper.addClass(styles.promo);
  }
}
