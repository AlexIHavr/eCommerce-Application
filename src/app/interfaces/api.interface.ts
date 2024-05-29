import { ProductsBrands, ProductsCategories, ProductsColors } from 'globalConsts/api.const';
import { Address, Country } from 'globalTypes/api.type';

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

export interface ProductPriceFilter {
  from?: number;
  to?: number;
}

export interface FilterProps {
  category: ProductsCategories;
  price?: ProductPriceFilter;
  brands?: ProductsBrands[];
  colors?: ProductsColors[];
}
