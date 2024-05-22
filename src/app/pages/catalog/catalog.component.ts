import { ProductsFilters } from 'pages/catalog/components/productsFilters/productsFilters.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import styles from './catalog.module.scss';

export class Catalog extends BaseComponent {
  constructor() {
    super(
      { className: styles.catalog },
      new SectionTitle('Catalog'),
      new ProductsFilters(),
      div({ className: sharedStyles.container }),
    );
  }
}
