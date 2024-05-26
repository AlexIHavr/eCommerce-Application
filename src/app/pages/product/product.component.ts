import { PRODUCTS_CARDS_MOCK } from 'pages/category/category.consts';
import { getCategoryBreadcrumbPath, getProductPath } from 'pages/pageWrapper.helpers';
import { ProductParams } from 'pages/pageWrapper.types';
import { Breadcrumbs } from 'pages/shared/components/breadcrumbs/breadcrumbs.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { BaseComponent } from 'shared/base/base.component';

import styles from './product.module.scss';

export class Product extends BaseComponent {
  constructor(params: ProductParams) {
    const product = PRODUCTS_CARDS_MOCK.find(({ id }) => id === params.id)!;

    super(
      { className: styles.product },
      new SectionTitle(product.name),
      new Breadcrumbs([
        getCategoryBreadcrumbPath(params.category),
        { name: product.name, path: getProductPath(params.category, params.id) },
      ]),
    );
  }
}
