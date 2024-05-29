import { ClientResponse } from '@commercetools/platform-sdk';

export type ApiClientResponse<T> = Promise<ClientResponse<T>>;

export type Country = 'BY' | 'UA';

export type Address = 'billing' | 'shipping';
