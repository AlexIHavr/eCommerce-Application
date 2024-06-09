import {
  ByProjectKeyRequestBuilder,
  Cart,
  ClientResponse,
  Customer,
  CustomerChangePassword,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  CustomerUpdateAction,
  ProductProjectionPagedSearchResponse,
  Project,
} from '@commercetools/platform-sdk';
import { TokenCache } from '@commercetools/sdk-client-v2';
import { PRODUCTS_CATEGORIES_IDS } from 'globalConsts/api.const';
import { ApiClientResponse } from 'globalTypes/api.type';
import { CustomerLoginData, FilterProps, NewCustomer, SortProps } from 'interfaces/api.interface';
import { clientBuild } from 'utils/clientBuild.util';
import { getQueryFilterString } from 'utils/strings.util';
import { tokenCache } from 'utils/tokenCache.util';

import { LocalStorageService } from './localStorage.service';

// import { LocalStorageService } from './localStorage.service';

// function setCartAnonymousId(): string {
//   const anonymousId = crypto.randomUUID();
//   LocalStorageService.saveData('cartAnonymousId', anonymousId);
//   return anonymousId;
// }

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

  public getCustomerById(customerId: string): ApiClientResponse<Customer> {
    return this.apiRoot.customers().withId({ ID: customerId }).get().execute();
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
    searchText?: string,
  ): ApiClientResponse<ProductProjectionPagedSearchResponse> {
    const { slug, category, price, brands, colors } = filterProps;

    const queryFilter: string[] = [];
    const querySort: string[] = [];

    if (slug) {
      queryFilter.push(`slug.en: "${slug}"`);
    }

    if (category) {
      queryFilter.push(`categories.id: "${PRODUCTS_CATEGORIES_IDS[category]}"`);
    }

    if (price) {
      queryFilter.push(
        `variants.price.centAmount: range (${price.from ? price.from * 100 : 0} to ${price.to ? price.to * 100 : '*'})`,
      );
    }

    if (brands && brands.length) {
      queryFilter.push(`variants.attributes.brand: ${getQueryFilterString(brands)}`);
    }

    if (colors && colors.length) {
      queryFilter.push(`variants.attributes.color.label: ${getQueryFilterString(colors)}`);
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
          fuzzy: false,
          'text.en': searchText,
        },
      })
      .execute();
  }

  public updateCustomerInfo(
    customerId: string,
    version: number,
    data: CustomerUpdateAction[],
  ): ApiClientResponse<Customer> {
    return this.apiRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version,
          actions: [...data],
        },
      })
      .execute();
  }

  public updateCustomerPassword(data: CustomerChangePassword): ApiClientResponse<Customer> {
    return this.apiRoot.customers().password().post({ body: data }).execute();
  }

  public updatePasswordFlowCredentials(credentials: CustomerLoginData): ApiClientResponse<Project> {
    tokenCache.resetCache();
    this.apiRoot = clientBuild.getApiRootByPasswordFlow(credentials);
    return this.apiRoot.get().execute();
  }

  public async createAnonymousCart(): Promise<ClientResponse<Cart> | void> {
    const cartId = LocalStorageService.getData('cartId');
    if (!cartId) {
      const cart = await this.apiRoot
        .carts()
        .post({
          body: {
            currency: 'USD',
            anonymousId: crypto.randomUUID(),
          },
        })
        .execute();
      LocalStorageService.saveData('cartId', cart.body.id);
      return cart;
    }
    return undefined;
  }

  public getCart(): Promise<ClientResponse<Cart>> | void {
    const cartId = LocalStorageService.getData('cartId');
    if (cartId) {
      return this.apiRoot.carts().withId({ ID: cartId }).get().execute();
    }
    return undefined;
  }

  public async addProductToCart(
    sku: string,
    quantity: number,
  ): Promise<ClientResponse<Cart> | void> {
    const cart = await this.getCart();
    if (cart) {
      return this.apiRoot
        .carts()
        .withId({ ID: cart.body.id })
        .post({
          body: {
            actions: [{ action: 'addLineItem', quantity, sku }],
            version: cart.body.version,
          },
        })
        .execute();
    }
    return undefined;
  }

  public async removeProductFromCart(lineItemId: string): Promise<ClientResponse<Cart> | void> {
    const cart = await this.getCart();
    if (cart) {
      return this.apiRoot
        .carts()
        .withId({ ID: cart.body.id })
        .post({
          body: {
            actions: [{ action: 'removeLineItem', lineItemId }],
            version: cart.body.version,
          },
        })
        .execute();
    }
    return undefined;
  }
}

export const apiService = new ApiService();
