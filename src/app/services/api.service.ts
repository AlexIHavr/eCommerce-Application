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

  public addCustomer(newCustomer: NewCustomer): ApiClientResponse<CustomerSignInResult> {
    return this.apiRoot.customers().post({ body: newCustomer }).execute();
  }

  public loginCustomer(newCustomer: CustomerLoginData): void {
    this.apiRoot = clientBuildUtil.getApiRootByFlow('password', newCustomer);
    this.apiRoot
      .login()
      .post({ body: newCustomer })
      .execute()
      .then((res) => {
        console.log('login OK', res);
        console.log(tokenCache);
      })
      .catch((res) => {
        console.log('login error', res);
        this.apiRoot = clientBuildUtil.getApiRootByFlow('anonymous');
      });
  }
}

export const apiService = new ApiService();
