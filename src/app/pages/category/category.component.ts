import { ProductsFilters } from 'pages/category/components/productsFilters/productsFilters.component';
import { CategoriesTypes } from 'pages/pageWrapper.consts';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';
import { capitalizeFirstLetter } from 'utils/strings.util';

import { getProducts } from './category.helpers';
import styles from './category.module.scss';

export class Category extends BaseComponent {
  constructor(type: CategoriesTypes) {
    super(
      { className: styles.category },
      new SectionTitle(capitalizeFirstLetter(type)),
      new ProductsFilters(),
      div(
        { className: sharedStyles.container },
        div({ className: styles.productsList }, ...getProducts()),
      ),
    );
  }
}
