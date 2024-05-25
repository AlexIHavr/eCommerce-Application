import {
  ByProjectKeyRequestBuilder,
  Customer,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  Project,
} from '@commercetools/platform-sdk';
import { TokenCache } from '@commercetools/sdk-client-v2';
import { ApiClientResponse } from 'globalTypes/api.type';
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

  public getCustomerById(customerId: string): ApiClientResponse<Customer> {
    return this.apiRoot.customers().withId({ ID: customerId }).get().execute();
  }

  public signupCustomer(newCustomer: NewCustomer): ApiClientResponse<CustomerSignInResult> {
    return this.apiRoot.me().signup().post({ body: newCustomer }).execute();
  }

  public logout(): void {
    this.apiRoot = clientBuild.getApiRootByAnonymousFlow();
  }
}

export const apiService = new ApiService();
