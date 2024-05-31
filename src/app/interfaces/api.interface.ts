import { ProductsBrands, ProductsCategories, ProductsColors } from 'globalConsts/api.const';
import { Address, Country, SortType, SortValue } from 'globalTypes/api.type';

export interface CustomerLoginData {
  email: string;
  password: string;
}

export interface NewCustomer extends CustomerLoginData {
  firstName: string;
  lastName: string;
  dateOfBirth: string; //* format (YYYY-MM-DD), for example: "2018-10-12"
  addresses: NewAddress[];
  defaultBillingAddress?: number; //* index in addresses field
  defaultShippingAddress?: number; //* index in addresses field
}

export interface NewAddress {
  key: Address;
  streetName: string;
  city: string;
  postalCode: string;
  country: Country;
}

export interface SortProps {
  value: SortValue;
  direction: SortType;
}

export interface FilterProps {
  id?: string;
  category?: ProductsCategories;
  price?: {
    from?: number;
    to?: number;
  };
  brands?: ProductsBrands[];
  colors?: ProductsColors[];
}
