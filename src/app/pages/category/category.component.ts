import { ProductProjection } from '@commercetools/platform-sdk';
import { PRODUCTS_COUNT_ON_PAGE, ProductsCategories } from 'globalConsts/api.const';
import { CartResponse } from 'globalTypes/api.type';
import { Div } from 'globalTypes/elements.type';
import { FilterProps, SortProps } from 'interfaces/api.interface';
import { ProductsFilters } from 'pages/category/components/productsFilters/productsFilters.component';
import { getCartId, getCategoryBreadcrumbPath } from 'pages/pageWrapper.helpers';
import { Breadcrumbs } from 'pages/shared/components/breadcrumbs/breadcrumbs.component';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/common.module.scss';
import { apiService } from 'services/api.service';
import { routingService } from 'services/routing.service';
import { alertModal } from 'shared/alert/alert.component';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { button, div, h3 } from 'shared/tags/tags.component';
import { capitalizeFirstLetter } from 'utils/strings.util';

import { getProducts } from './category.helpers';
import styles from './category.module.scss';

export class Category extends BaseComponent {
  private readonly productsList: Div;

  private readonly productsFilters: ProductsFilters;

  private readonly pagination: Div;

  private productsLinks: Div[] = [];

  private products?: ProductProjection[];

  private isInitProducts: boolean = true;

  private currentPage: number = 0;

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
    currentPage?: number,
  ): void {
    loader.open();
    apiService
      .getFilteredProducts(
        { category: this.category, ...filterProps },
        sortProps,
        searchText,
        currentPage,
      )
      .then((res) => {
        if (!currentPage) {
          this.products = res.body.results;
          this.currentPage = 0;
        }

        this.productsList.destroyChildren();
        this.pagination.destroyChildren();

        if (this.products?.length) {
          if (this.isInitProducts) {
            this.productsFilters.setProductsOptions(this.products);
            this.isInitProducts = false;
          }

          this.setProductsOnPages(this.products);
        } else {
          this.productsList.append(h3('No products'));
        }
      })
      .catch((error) => alertModal.showAlert('error', (error as Error).message))
      .finally(() => loader.close());
  }

  private async setProductsOnPages(products: ProductProjection[]): Promise<void> {
    const cartId = getCartId();
    let cart: CartResponse | undefined;

    if (cartId) cart = await apiService.getCart(cartId);

    this.productsLinks = getProducts(this.category, products, cart);

    const pagesCount = Math.ceil(this.productsLinks.length / PRODUCTS_COUNT_ON_PAGE);

    this.pagination.appendChildren(
      new Array(pagesCount).fill(null).map((_, index) => {
        const pageLink = button({
          className: styles.pageLink,
          text: String(index + 1),
          onclick: () => {
            this.currentPage = index;
            this.setProducts({}, undefined, undefined, index);
          },
        });

        if (index === this.currentPage) pageLink.addClass(styles.active);

        return pageLink;
      }),
    );

    this.goToPage();

    routingService.updateLinks();
  }

  private goToPage(): void {
    this.productsList.appendChildren(
      this.productsLinks.filter(
        (_, index) =>
          index >= this.currentPage * PRODUCTS_COUNT_ON_PAGE &&
          index < (this.currentPage + 1) * PRODUCTS_COUNT_ON_PAGE,
      ),
    );

    routingService.updateLinks();
  }
}
