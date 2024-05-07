import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  AuthMiddlewareOptions,
  Client,
  ClientBuilder,
  HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

const {
  VITE_CTP_AUTH_URL,
  VITE_CTP_PROJECT_KEY,
  VITE_CTP_API_URL,
  VITE_CTP_CLIENT_ID,
  VITE_CTP_CLIENT_SECRET,
  VITE_CTP_SCOPES,
} = import.meta.env;

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: VITE_CTP_AUTH_URL,
  projectKey: VITE_CTP_PROJECT_KEY,
  credentials: {
    clientId: VITE_CTP_CLIENT_ID,
    clientSecret: VITE_CTP_CLIENT_SECRET,
  },
  scopes: [VITE_CTP_SCOPES],
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: VITE_CTP_API_URL,
  fetch,
};

const ctpClient: Client = new ClientBuilder()
  // .withProjectKey(VITE_CTP_PROJECT_KEY)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: VITE_CTP_PROJECT_KEY,
});
