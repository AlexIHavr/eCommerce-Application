export interface NewCustomer {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  dateOfBirth: string; //* format (YYYY-MM-DD), for example: "2018-10-12"
  addresses: NewAddress[];
  defaultBillingAddress?: number; //* index in addresses field
  defaultShippingAddress?: number; //* index in addresses field
}

export interface NewAddress {
  key: 'billing' | 'shipping';
  streetName: string;
  city: string;
  postalCode: string;
  country: string; //* 'BY' | 'UA'
}

export interface CustomerLoginData {
  email: string;
  password: string;
}
