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
  private ctpClient!: Client;

  public apiRoot!: ByProjectKeyRequestBuilder;

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

  constructor() {
    this.setClientWithAnonymousFlow();
    this.setApiRoot();
  }

  private setClientWithAnonymousFlow(): void {
    this.ctpClient = new ClientBuilder()
      .withProjectKey(VITE_CTP_PROJECT_KEY)
      .withAnonymousSessionFlow(this.anonymousAuthMiddlewareOptions)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build();
  }

  private setClientWithPasswordFlow(customerData: CustomerLoginData): void {
    this.passwordAuthMiddlewareOptions.credentials.user.username = customerData.email;
    this.passwordAuthMiddlewareOptions.credentials.user.password = customerData.password;

    this.ctpClient = new ClientBuilder()
      .withProjectKey(VITE_CTP_PROJECT_KEY)
      .withPasswordFlow(this.passwordAuthMiddlewareOptions)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build();
  }

  private setClientWithRefreshFlow(refreshToken: string): void {
    this.refreshAuthMiddlewareOptions.refreshToken = refreshToken;

    this.ctpClient = new ClientBuilder()
      .withProjectKey(VITE_CTP_PROJECT_KEY)
      .withRefreshTokenFlow(this.refreshAuthMiddlewareOptions)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build();
  }

  private setApiRoot(): void {
    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({
      projectKey: VITE_CTP_PROJECT_KEY,
    });
  }

  public getApiRootByFlow(
    flow: 'anonymous' | 'password' | 'refresh',
    customerData?: CustomerLoginData,
  ): ByProjectKeyRequestBuilder {
    switch (flow) {
      case 'anonymous':
        this.setClientWithAnonymousFlow();
        break;
      case 'password':
        this.setClientWithPasswordFlow(customerData!);
        break;
      case 'refresh':
        this.setClientWithRefreshFlow(LocalStorageService.getData('refreshToken')!);
        break;
      default:
        break;
    }

    this.setApiRoot();
    return this.apiRoot;
  }
}

export const clientBuildUtil = new ClientBuildUtil();
