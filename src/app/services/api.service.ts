import {
  ByProjectKeyRequestBuilder,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  Project,
} from '@commercetools/platform-sdk';
import { TokenCache } from '@commercetools/sdk-client-v2';
import { ApiClientResponse } from 'globalTypes/api.type';
import { NewCustomer } from 'interfaces/api.interface';
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
}

export const apiService = new ApiService();
