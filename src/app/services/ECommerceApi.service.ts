import {
  ByProjectKeyRequestBuilder,
  ClientResponse,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  Project,
} from '@commercetools/platform-sdk';
import { NewCustomer } from 'interfaces/eCommerceApi.interface';
import apiRoot from 'utils/buildClient';

export default class ECommerceAPIService {
  private apiRoot: ByProjectKeyRequestBuilder;

  constructor() {
    this.apiRoot = apiRoot;
  }

  public getProject(): Promise<ClientResponse<Project>> {
    return this.apiRoot.get().execute();
  }

  public getCustomers(): Promise<ClientResponse<CustomerPagedQueryResponse>> {
    return this.apiRoot.customers().get().execute();
  }

  public addCustomer(newCustomer: NewCustomer): Promise<ClientResponse<CustomerSignInResult>> {
    return this.apiRoot
      .customers()
      .post({
        body: newCustomer,
      })
      .execute();
  }
}
