import { Div, Input } from 'globalTypes/elements.type';
import { centToDollar } from 'pages/cart/cart.helpers';
import cartStyles from 'pages/cart/cart.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { button, div, img, input } from 'shared/tags/tags.component';

import { MAX_PRODUCTS_QUANTITY_TO_ORDER, OVERQUANTITY_TEXT_ERROR } from './cartItem.consts';
import styles from './cartItem.module.scss';
import { CartItemProps } from './cartItem.types';

export class CartItem extends BaseComponent {
  private readonly priceWrapper: Div;

  private readonly quantity: Input;

  private readonly quantityError: Div;

  private readonly subtotal: Div;

  private readonly promoprice: Div;

  private readonly quantityCallback: (id: string, quantity: number) => void;

  public readonly id: string;

  constructor(
    props: CartItemProps,
    removeHandler: (id: string) => void,
    quantityHandler: (id: string, quantity: number) => void,
  ) {
    super({ className: cartStyles.cartItem });
    this.id = props.id;
    this.quantityCallback = quantityHandler;

    this.promoprice = div({ className: styles.promoPrice });

    this.priceWrapper = div(
      { className: styles.priceWrapper },
      div({ className: styles.originPrice, text: centToDollar(props.originPricePerOne) }),
      this.promoprice,
    );
    if (props.promoPricePerOne) this.showPromoPrice(props.promoPricePerOne);

    this.quantity = input({
      className: styles.quantity,
      type: 'text',
      value: props.quantity,
      autocomplete: 'off',
      onchange: () => this.changeQuantityHandler(),
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
        onclick: () => this.changeQuantityHandler('minus'),
      }),
      this.quantity,
      button({
        className: styles.quantityButton,
        text: '+',
        onclick: () => this.changeQuantityHandler('plus'),
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

  private changeQuantityHandler(action?: 'plus' | 'minus'): void {
    let quantity = +this.quantity.getNode().value;

    if (action === 'plus') quantity += 1;
    if (action === 'minus') quantity -= 1;
    this.quantity.setProps({ value: String(quantity) });

    if (quantity >= MAX_PRODUCTS_QUANTITY_TO_ORDER) {
      this.quantityError.setText(OVERQUANTITY_TEXT_ERROR);
    } else {
      this.quantityError.setText('');
      this.quantityCallback(this.id, quantity);
    }
  }

  public showPromoPrice(promoPrice: number): void {
    this.priceWrapper.addClass(styles.promo);
    this.promoprice.setText(centToDollar(promoPrice));
  }

  public updateSubtotal(subtotal: number): void {
    this.subtotal.setText(`Subtotal: ${centToDollar(subtotal)}`);
  }

  public updateQuantity(quantity: number, subtotal: number): void {
    this.quantity.setProps({ value: String(quantity) });
    this.updateSubtotal(subtotal);
  }
}
