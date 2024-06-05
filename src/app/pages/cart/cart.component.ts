import { Div } from 'globalTypes/elements.type';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import styles from './cart.module.scss';
import { CartItem } from './components/cartItem/cartItem.component';
import { CartItemProps } from './components/cartItem/cartItem.types';

export class Cart extends BaseComponent {
  private readonly cart: Div;

  constructor() {
    super({ className: styles.cartPage });
    this.cart = div({ className: styles.cart });

    this.appendChildren([
      new SectionTitle('Cart'),
      div({ className: sharedStyles.container }, this.cart),
    ]);

    this.renderCartItems();
  }

  private renderCartItems(): void {
    const item1: CartItemProps = {
      imageSrc: '',
      name: 'Upholstered 360° Swivel Accent Chair (brown)',
      originPrice: '$1 449.50',
      promoPrice: '$65.00',
      pricePerOne: '$37 502.00',
    };

    const item2: CartItemProps = {
      imageSrc: '',
      name: 'Lyon Sofa (orange)',
      originPrice: '$126.99',
      promoPrice: '$100.00',
      pricePerOne: '$2 920.11',
    };

    this.cart.appendChildren([new CartItem(item1), new CartItem(item2)]);
  }
}
