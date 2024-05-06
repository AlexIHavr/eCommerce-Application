import {
  ByProjectKeyRequestBuilder,
  ClientResponse,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  Project,
  ShoppingListPagedQueryResponse,
} from '@commercetools/platform-sdk';
import apiRoot from 'services/BuildClient.service';

export default class ECommerceAPIService {
  private apiRoot: ByProjectKeyRequestBuilder;

  constructor() {
    this.apiRoot = apiRoot;
  }

  public getProject(): Promise<ClientResponse<Project>> {
    return this.apiRoot.get().execute();
  }

  public getShoppingLists(): Promise<ClientResponse<ShoppingListPagedQueryResponse>> {
    return this.apiRoot.shoppingLists().get().execute();
  }

  public getCustomers(): Promise<ClientResponse<CustomerPagedQueryResponse>> {
    return this.apiRoot.customers().get().execute();
  }

  public addCustomer(): Promise<ClientResponse<CustomerSignInResult>> {
    return this.apiRoot
      .customers()
      .post({
        body: {
          email: 'evg.parxpmenko@gmail.com',
          firstName: 'Evgeny',
          lastName: 'Parkhomenko',
          password: '123qwe',
        },
      })
      .execute();
  }
}
