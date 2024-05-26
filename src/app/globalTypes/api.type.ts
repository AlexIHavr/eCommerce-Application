import { ClientResponse } from '@commercetools/platform-sdk';

export type ApiClientResponse<T> = Promise<ClientResponse<T>>;

export type Country = 'BY' | 'UA';

export type Address = 'billing' | 'shipping';

export type Categories = 'chairs' | 'sofas' | 'beds';

export enum CategoriesId {
  chairs = 'aaf8c963-3c9a-4208-bef3-79c2560468f5',
  sofas = '152e9396-eaca-4ee2-bc32-2b37ab2ea8c8',
  beds = '03933605-debc-43c0-86e9-ef19d49062b8',
}
