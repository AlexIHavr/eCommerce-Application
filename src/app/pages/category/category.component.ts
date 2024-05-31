import { ProductsCategories } from 'globalConsts/api.const';
import { Div } from 'globalTypes/elements.type';
import { FilterProps, SortProps } from 'interfaces/api.interface';
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
  private readonly productsList: Div;

  private productsFilters: ProductsFilters;

  private isInitProducts: boolean = true;

  constructor(private readonly category: ProductsCategories) {
    super(
      { className: styles.category },
      new SectionTitle(capitalizeFirstLetter(category)),
      new Breadcrumbs([getCategoryBreadcrumbPath(category)]),
    );

    this.productsList = div({ className: styles.productsList });

    this.productsFilters = new ProductsFilters(this);

    this.appendChildren([
      this.productsFilters,
      div({ className: sharedStyles.container }, this.productsList),
    ]);

    this.setProducts();
  }

  public setProducts(
    filterProps?: Omit<FilterProps, 'category'>,
    sortProps?: SortProps,
    searchText?: string,
  ): void {
    loader.open();
    apiService
      .getFilteredProducts({ category: this.category, ...filterProps }, sortProps, searchText)
      .then((res) => {
        const products = res.body.results;

        this.productsList.destroyChildren();

        if (products.length) {
          if (this.isInitProducts) {
            this.productsFilters.setProductsOptions(products);
            this.isInitProducts = false;
          }

          this.productsList.appendChildren(getProducts(this.category, products));
        } else {
          this.productsList.append(h3('No products'));
        }

        routingService.updateLinks();
      })
      .finally(() => loader.close());
  }
}
