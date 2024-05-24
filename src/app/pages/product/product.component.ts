import { PRODUCTS_CARDS } from 'pages/category/category.consts';
import { ProductParams } from 'pages/pageWrapper.types';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { BaseComponent } from 'shared/base/base.component';

import styles from './product.module.scss';

export class Product extends BaseComponent {
  constructor(params: ProductParams) {
    const product = PRODUCTS_CARDS.find(({ id }) => id === params.id)!;

    super({ className: styles.product }, new SectionTitle(product.name));
  }
}
