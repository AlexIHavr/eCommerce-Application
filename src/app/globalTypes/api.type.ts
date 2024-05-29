import { ClientResponse } from '@commercetools/platform-sdk';

export type ApiClientResponse<T> = Promise<ClientResponse<T>>;

export type Country = 'BY' | 'UA';

export type Address = 'billing' | 'shipping';

export type ProductCategories = 'chairs' | 'sofas' | 'beds';

export enum ProductCategoriesId {
  chairs = 'aaf8c963-3c9a-4208-bef3-79c2560468f5',
  sofas = '152e9396-eaca-4ee2-bc32-2b37ab2ea8c8',
  beds = '03933605-debc-43c0-86e9-ef19d49062b8',
}

export enum ProductBrands {
  colamy = 'COLAMY',
  feonase = 'Feonase',
  mellow = 'Mellow',
  novilla = 'Novilla',
  poly_and_bark = 'POLY & BARK',
  shintenchi = 'Shintenchi',
  vecelo = 'VECELO',
  zinus = 'ZINUS',
}

export enum ProductColors {
  black = 'black',
  grey = 'grey',
  white = 'white',
  brown = 'brown',
  beige = 'beige',
  red = 'red',
  pink = 'pink',
  orange = 'orange',
  yellow = 'yellow',
  ivory = 'ivory',
  green = 'green',
  blue = 'blue',
  purple = 'purple',
  gold = 'gold',
  silver = 'silver',
  multi = 'multi',
}

export type ProductPriceFromFilter = {
  from: number | '*';
  to: number | '*';
};
