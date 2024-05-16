import {
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import {
  AnonymousAuthMiddlewareOptions,
  Client,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { CustomerLoginData } from 'interfaces/api.interface';
import { LocalStorageService } from 'services/localStorage.service';

import { tokenCache } from './tokenCache.util';

const {
  VITE_CTP_AUTH_URL,
  VITE_CTP_PROJECT_KEY,
  VITE_CTP_API_URL,
  VITE_CTP_CLIENT_ID,
  VITE_CTP_CLIENT_SECRET,
  VITE_CTP_SCOPES,
} = import.meta.env;

class ClientBuildUtil {
  private ctpClient: Client;

  public apiRoot: ByProjectKeyRequestBuilder;

  private httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: VITE_CTP_API_URL,
    fetch,
  };

  private anonymousAuthMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
    host: VITE_CTP_AUTH_URL,
    projectKey: VITE_CTP_PROJECT_KEY,
    credentials: {
      clientId: VITE_CTP_CLIENT_ID,
      clientSecret: VITE_CTP_CLIENT_SECRET,
    },
    scopes: [VITE_CTP_SCOPES],
    fetch,
  };

  private passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
    host: VITE_CTP_AUTH_URL,
    projectKey: VITE_CTP_PROJECT_KEY,
    credentials: {
      clientId: VITE_CTP_CLIENT_ID,
      clientSecret: VITE_CTP_CLIENT_SECRET,
      user: {
        username: '',
        password: '',
      },
    },
    scopes: [VITE_CTP_SCOPES],
    fetch,
    tokenCache,
  };

  private refreshAuthMiddlewareOptions: RefreshAuthMiddlewareOptions = {
    host: VITE_CTP_AUTH_URL,
    projectKey: VITE_CTP_PROJECT_KEY,
    credentials: {
      clientId: VITE_CTP_CLIENT_ID,
      clientSecret: VITE_CTP_CLIENT_SECRET,
    },
    refreshToken: '',
    fetch,
    tokenCache,
  };

  private basicClientBuilder: ClientBuilder;

  constructor() {
    this.basicClientBuilder = new ClientBuilder()
      .withProjectKey(VITE_CTP_PROJECT_KEY)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .withLoggerMiddleware();

    this.ctpClient = this.getClientByLogin();

    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({
      projectKey: VITE_CTP_PROJECT_KEY,
    });
  }

  private setClientWithAnonymousFlow(): void {
    this.ctpClient = this.basicClientBuilder
      .withAnonymousSessionFlow(this.anonymousAuthMiddlewareOptions)
      .build();
  }

  private setClientWithPasswordFlow(customerData: CustomerLoginData): void {
    this.passwordAuthMiddlewareOptions.credentials.user.username = customerData.email;
    this.passwordAuthMiddlewareOptions.credentials.user.password = customerData.password;

    this.ctpClient = this.basicClientBuilder
      .withPasswordFlow(this.passwordAuthMiddlewareOptions)
      .build();
  }

  // private setClientWithRefreshFlow(refreshToken: string): void {
  //   this.refreshAuthMiddlewareOptions.refreshToken = refreshToken;

  //   this.ctpClient = this.basicClientBuilder
  //     .withRefreshTokenFlow(this.refreshAuthMiddlewareOptions)
  //     .build();
  // }

  private updateApiRoot(): void {
    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({
      projectKey: VITE_CTP_PROJECT_KEY,
    });
  }

  public getApiRootByFlow(
    flow: 'anonymous' | 'password',
    customerData?: CustomerLoginData,
  ): ByProjectKeyRequestBuilder {
    switch (flow) {
      case 'anonymous':
        this.setClientWithAnonymousFlow();
        break;

      case 'password':
        if (customerData) {
          this.setClientWithPasswordFlow(customerData);
        } else {
          throw new Error('customerData was not passed');
        }
        break;

      default:
        break;
    }

    this.updateApiRoot();
    return this.apiRoot;
  }

  private getClientByLogin(): Client {
    const refreshToken = LocalStorageService.getData('refreshToken');
    if (refreshToken) {
      this.refreshAuthMiddlewareOptions.refreshToken = refreshToken;
      return this.basicClientBuilder
        .withRefreshTokenFlow(this.refreshAuthMiddlewareOptions)
        .build();
    }
    return this.basicClientBuilder
      .withAnonymousSessionFlow(this.anonymousAuthMiddlewareOptions)
      .build();
  }
}

export const clientBuildUtil = new ClientBuildUtil();
