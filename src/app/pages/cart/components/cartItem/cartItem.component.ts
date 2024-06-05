import { Div } from 'globalTypes/elements.type';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, img } from 'shared/tags/tags.component';

import styles from './cartItem.module.scss';
import { CartItemProps } from './cartItem.types';

export class CartItem extends BaseComponent {
  private readonly priceWrapper: Div;

  private readonly quantity: Div;

  private readonly subtotal: Div;

  constructor(props: CartItemProps) {
    super({ className: styles.cartItem });

    this.priceWrapper = div(
      { className: styles.priceWrapper },
      div({ className: styles.originPrice, text: props.originPrice }),
      div({ className: styles.promoPrice, text: props.promoPrice }),
    );

    this.quantity = div({ className: styles.quantity, text: '1' });
    this.subtotal = div({ className: styles.subtotal, text: `Subtotal: ${props.pricePerOne}` });

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
