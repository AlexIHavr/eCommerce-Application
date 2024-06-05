import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductsCategories } from 'globalConsts/api.const';
import { Div } from 'globalTypes/elements.type';
import { SearchParams } from 'globalTypes/routing.type';
import { FilterProps, SortProps } from 'interfaces/api.interface';
import { ProductsFilters } from 'pages/category/components/productsFilters/productsFilters.component';
import { getCategoryBreadcrumbPath, getCategoryPath, getNavLink } from 'pages/pageWrapper.helpers';
import { CategorySearchParams } from 'pages/pageWrapper.types';
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

  private productsFilters: ProductsFilters;

  private pagination: Div;

  private isInitProducts: boolean = true;

  constructor(
    private readonly category: ProductsCategories,
    private readonly searchParams: SearchParams,
  ) {
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

          this.setProductsOnPage(products);
        } else {
          this.productsList.append(h3('No products'));
        }

        routingService.updateLinks();
      })
      .finally(() => loader.close());
  }

  private setProductsOnPage(products: ProductProjection[]): void {
    const productsLinks = getProducts(this.category, products);
    const pagesCount = Math.ceil(productsLinks.length / PRODUCTS_COUNT_ON_PAGE);

    let pageNumber = 1;

    if (this.searchParams) {
      const pageParam = Number((this.searchParams as CategorySearchParams)?.page);

      if (!Number.isNaN(pageParam)) {
        pageNumber = pageParam > pagesCount ? pagesCount : pageParam;
      }
    }

    this.pagination.appendChildren(
      new Array(pagesCount).fill(null).map((_, index) => {
        const pageIndex = String(index + 1);

        const pageLink = getNavLink(
          '',
          getCategoryPath(this.category, { page: pageIndex }),
          styles.pageLink,
          button({ className: styles.pageLinkButton, text: pageIndex }),
        );

        if (index + 1 === pageNumber) pageLink.addClass(styles.active);

        return pageLink;
      }),
    );

    this.productsList.appendChildren(
      productsLinks.filter(
        (_, index) =>
          index >= (pageNumber - 1) * PRODUCTS_COUNT_ON_PAGE &&
          index < pageNumber * PRODUCTS_COUNT_ON_PAGE,
      ),
    );
  }
}
