import {
  ByProjectKeyRequestBuilder,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  Project,
} from '@commercetools/platform-sdk';
import { TokenCache } from '@commercetools/sdk-client-v2';
import { ApiClientResponse } from 'globalTypes/api.type';
import { CustomerLoginData, NewCustomer } from 'interfaces/api.interface';
import { clientBuildUtil } from 'utils/clientBuild.util';
import { tokenCache } from 'utils/tokenCache.util';

export class ApiService {
  public apiRoot: ByProjectKeyRequestBuilder;

  public tokenCache: TokenCache;

  constructor() {
    this.apiRoot = clientBuildUtil.apiRoot;
    this.tokenCache = tokenCache;
  }

  public getProject(): ApiClientResponse<Project> {
    return this.apiRoot.get().execute();
  }

  public getCustomers(): ApiClientResponse<CustomerPagedQueryResponse> {
    return this.apiRoot.customers().get().execute();
  }

  public loginCustomer(newCustomer: CustomerLoginData): ApiClientResponse<CustomerSignInResult> {
    this.apiRoot = clientBuildUtil.getApiRootByFlow('password', newCustomer);
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
    this.apiRoot = clientBuildUtil.getApiRootByFlow('anonymous');
  }
}

export const apiService = new ApiService();
