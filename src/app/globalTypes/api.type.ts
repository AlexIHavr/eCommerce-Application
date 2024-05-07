import { ClientResponse } from '@commercetools/platform-sdk';

export type ApiClientResponse<T> = Promise<ClientResponse<T>>;
