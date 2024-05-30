import {
  ByProjectKeyRequestBuilder,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  ProductProjectionPagedSearchResponse,
  Project,
} from '@commercetools/platform-sdk';
import { TokenCache } from '@commercetools/sdk-client-v2';
import { PRODUCTS_CATEGORIES_IDS } from 'globalConsts/api.const';
import { ApiClientResponse } from 'globalTypes/api.type';
import { CustomerLoginData, FilterProps, NewCustomer, SortProps } from 'interfaces/api.interface';
import { clientBuild } from 'utils/clientBuild.util';
import { createQueryStringForFilter } from 'utils/strings.util';
import { tokenCache } from 'utils/tokenCache.util';

export class ApiService {
  public apiRoot: ByProjectKeyRequestBuilder;

  public tokenCache: TokenCache;

  constructor() {
    this.apiRoot = clientBuild.apiRoot;
    this.tokenCache = tokenCache;
  }

  public getProject(): ApiClientResponse<Project> {
    return this.apiRoot.get().execute();
  }

  public getCustomers(): ApiClientResponse<CustomerPagedQueryResponse> {
    return this.apiRoot.customers().get().execute();
  }

  public loginCustomer(newCustomer: CustomerLoginData): ApiClientResponse<CustomerSignInResult> {
    this.apiRoot = clientBuild.getApiRootByPasswordFlow(newCustomer);

    return this.apiRoot.login().post({ body: newCustomer }).execute();
  }

  public getCustomerByEmail(customerEmail: string): ApiClientResponse<CustomerPagedQueryResponse> {
    return this.apiRoot
      .customers()
      .get({ queryArgs: { where: `email="${customerEmail}"` } })
      .execute();
  }

  public signupCustomer(newCustomer: NewCustomer): ApiClientResponse<CustomerSignInResult> {
    return this.apiRoot.me().signup().post({ body: newCustomer }).execute();
  }

  public logout(): void {
    this.apiRoot = clientBuild.getApiRootByAnonymousFlow();
  }

  public getFilteredProducts(
    filterProps: FilterProps,
    sortProps?: SortProps,
  ): ApiClientResponse<ProductProjectionPagedSearchResponse> {
    const { id, category, price, brands, colors } = filterProps;

    const queryFilter: string[] = [];
    const querySort: string[] = [];

    if (id) {
      queryFilter.push(`id: "${id}"`);
    }

    if (category) {
      queryFilter.push(`categories.id: "${PRODUCTS_CATEGORIES_IDS[category]}"`);
    }

    if (price) {
      queryFilter.push(
        `variants.price.centAmount: range (${price.from ?? '*'} to ${price.to ?? '*'})`,
      );
    }

    if (brands && brands.length) {
      queryFilter.push(`variants.attributes.brand: ${createQueryStringForFilter(brands)}`);
    }

    if (colors && colors.length) {
      queryFilter.push(`variants.attributes.color.label: ${createQueryStringForFilter(colors)}`);
    }

    if (sortProps?.value === 'name') {
      querySort.push(`name.en ${sortProps.direction}`);
    } else if (sortProps?.value === 'price') {
      querySort.push(`price ${sortProps.direction}`);
    }

    return this.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          markMatchingVariants: true,
          filter: queryFilter,
          sort: querySort,
        },
      })
      .execute();
  }
}

export const apiService = new ApiService();
