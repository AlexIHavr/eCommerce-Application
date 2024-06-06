import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductsCategories } from 'globalConsts/api.const';
import { Anchor, Div } from 'globalTypes/elements.type';
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
import { button, div, h3 } from 'shared/tags/tags.component';
import { capitalizeFirstLetter } from 'utils/strings.util';

import { PRODUCTS_COUNT_ON_PAGE } from './category.consts';
import { getProducts } from './category.helpers';
import styles from './category.module.scss';

export class Category extends BaseComponent {
  private readonly productsList: Div;

  private readonly productsFilters: ProductsFilters;

  private readonly pagination: Div;

  private productsLinks: Anchor[] = [];

  private isInitProducts: boolean = true;

  constructor(private readonly category: ProductsCategories) {
    super(
      { className: styles.category },
      new SectionTitle(capitalizeFirstLetter(category)),
      new Breadcrumbs([getCategoryBreadcrumbPath(category)]),
    );

    this.productsList = div({ className: styles.productsList });

    this.pagination = div({ className: styles.pagination });

    this.productsFilters = new ProductsFilters(this);

    this.appendChildren([
      this.productsFilters,
      div({ className: sharedStyles.container }, this.productsList, this.pagination),
    ]);

    this.setProducts({});
  }

  public setProducts(
    filterProps: Omit<FilterProps, 'category'>,
    sortProps?: SortProps,
    searchText?: string,
  ): void {
    loader.open();
    apiService
      .getFilteredProducts({ category: this.category, ...filterProps }, sortProps, searchText)
      .then((res) => {
        const products = res.body.results;

        this.productsList.destroyChildren();
        this.pagination.destroyChildren();

        if (products.length) {
          if (this.isInitProducts) {
            this.productsFilters.setProductsOptions(products);
            this.isInitProducts = false;
          }

          this.setProductsOnPages(products);
        } else {
          this.productsList.append(h3('No products'));
        }

        routingService.updateLinks();
      })
      .finally(() => loader.close());
  }

  private setProductsOnPages(products: ProductProjection[]): void {
    this.productsLinks = getProducts(this.category, products);

    const pagesCount = Math.ceil(this.productsLinks.length / PRODUCTS_COUNT_ON_PAGE);

    this.pagination.appendChildren(
      new Array(pagesCount).fill(null).map((_, index) => {
        const pageLink = button({
          className: styles.pageLink,
          text: String(index + 1),
          onclick: () => {
            this.pagination.getChildren().forEach((child) => child.removeClass(styles.active));
            pageLink.addClass(styles.active);
            this.goToPage(index + 1);
          },
        });

        if (!index) pageLink.addClass(styles.active);

        return pageLink;
      }),
    );

    this.goToPage(1);
  }

  private goToPage(page: number): void {
    this.productsList.destroyChildren();

    this.productsList.appendChildren(
      this.productsLinks.filter(
        (_, index) =>
          index >= (page - 1) * PRODUCTS_COUNT_ON_PAGE && index < page * PRODUCTS_COUNT_ON_PAGE,
      ),
    );

    routingService.updateLinks();
  }
}
