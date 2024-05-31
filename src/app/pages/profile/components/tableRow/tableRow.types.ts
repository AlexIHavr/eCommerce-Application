import { Address, Country } from 'globalTypes/api.type';

export type TableRowProps = {
  type: Address;
  city: string;
  street: string;
  postalCode: string;
  country: Country;
  addressId: string;
  defaultBilAddress?: string;
  defaultShipAddress?: string;
};
