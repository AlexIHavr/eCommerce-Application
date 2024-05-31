import {
  ByProjectKeyRequestBuilder,
  CategoryPagedQueryResponse,
  Customer,
  CustomerChangePassword,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  CustomerUpdateAction,
  ProductPagedQueryResponse,
  ProductProjectionPagedSearchResponse,
  Project,
} from '@commercetools/platform-sdk';
import { TokenCache } from '@commercetools/sdk-client-v2';
import {
  ApiClientResponse,
  ProductBrands,
  ProductCategories,
  ProductCategoriesId,
  ProductColors,
  ProductPriceFromFilter,
} from 'globalTypes/api.type';
import { CustomerLoginData, NewCustomer } from 'interfaces/api.interface';
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

  public getCustomerById(customerId: string): ApiClientResponse<Customer> {
    return this.apiRoot.customers().withId({ ID: customerId }).get().execute();
  }

  public signupCustomer(newCustomer: NewCustomer): ApiClientResponse<CustomerSignInResult> {
    return this.apiRoot.me().signup().post({ body: newCustomer }).execute();
  }

  public logout(): void {
    this.apiRoot = clientBuild.getApiRootByAnonymousFlow();
  }

  public getAllProducts(): ApiClientResponse<ProductPagedQueryResponse> {
    return this.apiRoot.products().get().execute();
  }

  public getCategoryByExternalId(
    externalId: ProductCategories,
  ): ApiClientResponse<CategoryPagedQueryResponse> {
    return this.apiRoot
      .categories()
      .get({ queryArgs: { where: `externalId="${externalId}"` } })
      .execute();
  }

  public getProductsByCategoryId(
    categoryId: ProductCategoriesId,
  ): ApiClientResponse<ProductProjectionPagedSearchResponse> {
    return this.apiRoot
      .productProjections()
      .search()
      .get({ queryArgs: { filter: `categories.id:"${categoryId}"` } })
      .execute();
  }

  public getProductsByBrand(
    brand: string,
  ): ApiClientResponse<ProductProjectionPagedSearchResponse> {
    return this.apiRoot
      .productProjections()
      .search()
      .get({ queryArgs: { filter: `variants.attributes.brand:"${brand}"` } })
      .execute();
  }

  public getProductsByColor(
    color: string,
  ): ApiClientResponse<ProductProjectionPagedSearchResponse> {
    return this.apiRoot
      .productProjections()
      .search()
      .get({ queryArgs: { filter: `variants.attributes.color.label:"${color}"` } })
      .execute();
  }

  public getFilteredProducts(
    categoryId: ProductCategoriesId,
    price?: ProductPriceFromFilter,
    brands?: ProductBrands[],
    colors?: ProductColors[],
  ): ApiClientResponse<ProductProjectionPagedSearchResponse> {
    const queryFilter = [`categories.id:"${categoryId}"`];

    if (price) {
      queryFilter.push(`variants.price.centAmount:range (${price.from} to ${price.to})`);
    }
    if (brands) {
      queryFilter.push(`variants.attributes.brand: ${createQueryStringForFilter(brands)}`);
    }
    if (colors) {
      queryFilter.push(`variants.attributes.color.label: ${createQueryStringForFilter(colors)}`);
    }
    return this.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          markMatchingVariants: true,
          filter: queryFilter,
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
}

export const apiService = new ApiService();
