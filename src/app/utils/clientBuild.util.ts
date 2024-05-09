import {
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import {
  AnonymousAuthMiddlewareOptions,
  // AuthMiddlewareOptions,
  Client,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

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
      anonymousId: crypto.randomUUID(),
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
        username: 'johndoe@example.com',
        password: 'secret123',
      },
    },
    scopes: [VITE_CTP_SCOPES],
    fetch,
    tokenCache,
  };

  // private authMiddlewareOptions: AuthMiddlewareOptions = {
  //   host: VITE_CTP_AUTH_URL,
  //   projectKey: VITE_CTP_PROJECT_KEY,
  //   credentials: {
  //     clientId: VITE_CTP_CLIENT_ID,
  //     clientSecret: VITE_CTP_CLIENT_SECRET,
  //   },
  //   scopes: [VITE_CTP_SCOPES],
  //   fetch,
  // };

  private ctpClient!: Client;

  public apiRoot!: ByProjectKeyRequestBuilder;

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

  private setClientWithPasswordFlow(): void {
    this.ctpClient = new ClientBuilder()
      .withProjectKey(VITE_CTP_PROJECT_KEY)
      .withPasswordFlow(this.passwordAuthMiddlewareOptions)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build();
  }

  private setApiRoot(): void {
    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({
      projectKey: VITE_CTP_PROJECT_KEY,
    });
  }

  public getApiRootByFlow(flow: 'anonymous' | 'password'): ByProjectKeyRequestBuilder {
    switch (flow) {
      case 'anonymous':
        this.setClientWithAnonymousFlow();
        break;
      case 'password':
        this.setClientWithPasswordFlow();
        break;
      default:
        break;
    }

    this.setApiRoot();
    return this.apiRoot;
  }
}

export const clientBuildUtil = new ClientBuildUtil();
