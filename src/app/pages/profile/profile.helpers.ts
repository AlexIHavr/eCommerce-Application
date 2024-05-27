import { Customer } from '@commercetools/platform-sdk';

import { ProfileInfoProps } from './profileContent/profileInfo.types';

export function makeProfileProps(data: Customer): ProfileInfoProps {
  const customerAddresses = data.addresses.map((addr) => {
    const address = {
      type: data.billingAddressIds?.includes(addr.id!) ? 'billing' : 'shipping',
      city: addr.city,
      street: addr.streetName,
      postalCode: addr.postalCode,
      country: addr.country,
      addressId: addr.id,
      defaultBilAddress: '',
      defaultShipAddress: '',
    };

    if (data.defaultBillingAddressId) address.defaultBilAddress = data.defaultBillingAddressId;
    if (data.defaultShippingAddressId) address.defaultShipAddress = data.defaultShippingAddressId;

    return address;
  });

  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    dateOfBirth: data.dateOfBirth,
    addresses: customerAddresses,
  } as ProfileInfoProps;
}
