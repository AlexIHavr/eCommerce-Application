import { ProductsCategories } from 'globalConsts/api.const';
import { ProductsFilters } from 'pages/category/components/productsFilters/productsFilters.component';
import { getCategoryBreadcrumbPath } from 'pages/pageWrapper.helpers';
import { Breadcrumbs } from 'pages/shared/components/breadcrumbs/breadcrumbs.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { apiService } from 'services/api.service';
import { routingService } from 'services/routing.service';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { div, h3 } from 'shared/tags/tags.component';
import { capitalizeFirstLetter } from 'utils/strings.util';

import { getProducts } from './category.helpers';
import styles from './category.module.scss';

export class Category extends BaseComponent {
  constructor(private readonly category: ProductsCategories) {
    super(
      { className: styles.category },
      new SectionTitle(capitalizeFirstLetter(category)),
      new Breadcrumbs([getCategoryBreadcrumbPath(category)]),
      new ProductsFilters(),
    );

    this.setProducts();
  }

  private setProducts(): void {
    loader.open();
    apiService
      .getFilteredProducts(this.category)
      .then((res) => {
        const products = res.body.results;

        const productsList = div({ className: styles.productsList });

        if (products.length) {
          productsList.appendChildren(getProducts(this.category, products));
        } else {
          productsList.append(h3('No products'));
        }

        this.append(div({ className: sharedStyles.container }, productsList));
        routingService.updateLinks();
      })
      .finally(() => loader.close());
  }
}
