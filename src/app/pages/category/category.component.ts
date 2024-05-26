import { ProductsFilters } from 'pages/category/components/productsFilters/productsFilters.component';
import { getCategoryBreadcrumbPath } from 'pages/pageWrapper.helpers';
import { CategoryParams } from 'pages/pageWrapper.types';
import { Breadcrumbs } from 'pages/shared/components/breadcrumbs/breadcrumbs.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';
import { capitalizeFirstLetter } from 'utils/strings.util';

import { getProducts } from './category.helpers';
import styles from './category.module.scss';

export class Category extends BaseComponent {
  constructor({ category }: CategoryParams) {
    super(
      { className: styles.category },
      new SectionTitle(capitalizeFirstLetter(category)),
      new Breadcrumbs([getCategoryBreadcrumbPath(category)]),
      new ProductsFilters(),
      div(
        { className: sharedStyles.container },
        div({ className: styles.productsList }, ...getProducts(category)),
      ),
    );
  }
}
