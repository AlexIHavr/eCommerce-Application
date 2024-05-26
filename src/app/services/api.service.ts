import {
  ByProjectKeyRequestBuilder,
  CategoryPagedQueryResponse,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  ProductPagedQueryResponse,
  ProductProjectionPagedSearchResponse,
  Project,
} from '@commercetools/platform-sdk';
import { TokenCache } from '@commercetools/sdk-client-v2';
import { ApiClientResponse, Categories, CategoriesId } from 'globalTypes/api.type';
import { CustomerLoginData, NewCustomer } from 'interfaces/api.interface';
import { clientBuild } from 'utils/clientBuild.util';
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

  public getAllProducts(): ApiClientResponse<ProductPagedQueryResponse> {
    return this.apiRoot.products().get().execute();
  }

  public getCategoryByExternalId(
    externalId: Categories,
  ): ApiClientResponse<CategoryPagedQueryResponse> {
    return this.apiRoot
      .categories()
      .get({ queryArgs: { where: `externalId="${externalId}"` } })
      .execute();
  }

  public getProductsByCategoryId(
    categoryId: CategoriesId,
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
}

export const apiService = new ApiService();
