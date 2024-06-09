import {
  ByProjectKeyRequestBuilder,
  Cart,
  CartUpdateAction,
  ClientResponse,
  Customer,
  CustomerChangePassword,
  CustomerPagedQueryResponse,
  CustomerSignin,
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

  public loginCustomer(newCustomer: CustomerSignin): ApiClientResponse<CustomerSignInResult> {
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
    this.createAnonymousCart();
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
    const anonymousCartId = LocalStorageService.getData('anonymousCartId');
    const customerCartId = LocalStorageService.getData('customerCartId');
    if (!anonymousCartId && !customerCartId) {
      const cart = await this.apiRoot
        .carts()
        .post({
          body: {
            currency: 'USD',
            anonymousId: crypto.randomUUID(),
          },
        })
        .execute();
      LocalStorageService.saveData('anonymousCartId', cart.body.id);
      return cart;
    }
    return undefined;
  }

  public getCart(): ApiClientResponse<Cart> {
    const anonymousCartId = LocalStorageService.getData('anonymousCartId');
    const customerCartId = LocalStorageService.getData('customerCartId');
    if (customerCartId) {
      return this.apiRoot.carts().withId({ ID: customerCartId }).get().execute();
    }
    return this.apiRoot.carts().withId({ ID: anonymousCartId! }).get().execute();
  }

  public async addProductToCart(sku: string): ApiClientResponse<Cart> {
    const cart = await this.getCart();

    return this.apiRoot
      .carts()
      .withId({ ID: cart.body.id })
      .post({
        body: {
          actions: [{ action: 'addLineItem', sku }],
          version: cart.body.version,
        },
      })
      .execute();
  }

  public async removeProductFromCart(lineItemId: string): ApiClientResponse<Cart> {
    const cart = await this.getCart();

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

  public async changeProductQuantity(
    quantity: number,
    lineItemId: string,
  ): ApiClientResponse<Cart> {
    const cart = await this.getCart();

    return this.apiRoot
      .carts()
      .withId({ ID: cart.body.id })
      .post({
        body: {
          actions: [{ action: 'changeLineItemQuantity', lineItemId, quantity }],
          version: cart.body.version,
        },
      })
      .execute();
  }

  public async clearCart(): ApiClientResponse<Cart> {
    const cart = await this.getCart();

    const updateActions: CartUpdateAction[] = cart.body.lineItems.map((lineItem) => ({
      action: 'removeLineItem',
      lineItemId: lineItem.id,
    }));

    return this.apiRoot
      .carts()
      .withId({ ID: cart.body.id })
      .post({
        body: {
          actions: updateActions,
          version: cart.body.version,
        },
      })
      .execute();
  }

  public createCustomerCart(): ApiClientResponse<Cart> {
    return this.apiRoot
      .me()
      .carts()
      .post({ body: { currency: 'USD' } })
      .execute();
  }
}

export const apiService = new ApiService();
