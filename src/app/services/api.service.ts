import {
  ByProjectKeyRequestBuilder,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  Project,
} from '@commercetools/platform-sdk';
import { ApiClientResponse } from 'globalTypes/api.type';
import { NewCustomer } from 'interfaces/api.interface';
import { apiRoot } from 'utils/clientBuild.util';

export class ApiService {
  private apiRoot: ByProjectKeyRequestBuilder;

  constructor() {
    this.apiRoot = apiRoot;
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
