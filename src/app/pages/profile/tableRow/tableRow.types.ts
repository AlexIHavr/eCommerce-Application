export type TableRowProps = {
  type: 'billing' | 'shipping';
  city: string;
  street: string;
  postalCode: string;
  country: 'BY' | 'UA';
  addressId: string;
  defaultBilAddress?: string;
  defaultShipAddress?: string;
};
