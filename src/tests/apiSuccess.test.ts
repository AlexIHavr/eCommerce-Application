import { ProductsBrands, ProductsColors } from 'globalConsts/api.const';
import {
  getProductBrand,
  getProductColor,
  getProductDiscount,
  getProductName,
  getProductPrice,
} from 'pages/pageWrapper.helpers';
import {
  setFirstNameAction,
  setLastNameAction,
} from 'pages/profile/components/profileInfo/profileInfo.actions';
import { apiService } from 'services/api.service';
import { describe, expect, test } from 'vitest';

describe('api success login', () => {
  test('check no errors during login', () => {
    expect.assertions(0);

    return apiService.loginCustomer({
      email: 'test@mail.ru',
      password: 'Qwerty123',
    });
  });
});

describe('api success change password', () => {
  test('check no errors during changing password', async () => {
    expect.assertions(0);

    const currentPassword = 'Qwerty123';

    const {
      body: { customer },
    } = await apiService.loginCustomer({
      email: 'test@mail.ru',
      password: currentPassword,
    });

    await apiService.updateCustomerPassword({
      id: customer.id,
      version: customer.version,
      currentPassword,
      newPassword: currentPassword,
    });

    await apiService.updatePasswordFlowCredentials({
      email: customer.email,
      password: currentPassword,
    });
  });
});

describe('api success change customer data', () => {
  test('check no errors during changing first name and last name', async () => {
    const newFirstName = 'New first name';
    const newLastName = 'New last name';

    const {
      body: { customer },
    } = await apiService.loginCustomer({
      email: 'test@mail.ru',
      password: 'Qwerty123',
    });

    const data = await apiService.updateCustomerInfo(customer.id, customer.version, [
      setFirstNameAction(newFirstName),
      setLastNameAction(newLastName),
    ]);

    expect(data.body.firstName).toBe(newFirstName);
    expect(data.body.lastName).toBe(newLastName);
  });
});

describe('api success filter products', () => {
  test('check correct filter price', async () => {
    const fromPrice = 100;
    const toPrice = 150;

    const products = await apiService.getFilteredProducts({
      filterProps: { price: { from: fromPrice, to: toPrice } },
    });

    products.body.results.forEach(({ masterVariant, variants }) => {
      const price = getProductDiscount(masterVariant) ?? getProductPrice(masterVariant);

      expect(price).toBeGreaterThanOrEqual(fromPrice);
      expect(price).toBeLessThanOrEqual(toPrice);

      variants
        .filter(({ isMatchingVariant }) => isMatchingVariant)
        .forEach((variant) => {
          const variantPrice = getProductDiscount(variant) ?? getProductPrice(variant);

          expect(variantPrice).toBeGreaterThanOrEqual(fromPrice);
          expect(variantPrice).toBeLessThanOrEqual(toPrice);
        });
    });
  });

  test('check correct filter brand and color', async () => {
    const brands = [ProductsBrands.COLAMY, ProductsBrands.MELLOW];
    const colors = [ProductsColors.GREEN, ProductsColors.BLUE];

    const products = await apiService.getFilteredProducts({ filterProps: { brands, colors } });

    products.body.results
      .filter(({ masterVariant: { isMatchingVariant } }) => isMatchingVariant)
      .forEach(({ masterVariant, variants }) => {
        const brand = getProductBrand(masterVariant);
        const color = getProductColor(masterVariant);

        expect(brands).toContain(brand);
        expect(colors).toContain(color);

        variants
          .filter(({ isMatchingVariant }) => isMatchingVariant)
          .forEach((variant) => {
            const variantBrand = getProductBrand(variant);
            const variantColor = getProductColor(variant);

            expect(brands).toContain(variantBrand);
            expect(colors).toContain(variantColor);
          });
      });
  });

  test('check sort products by name', async () => {
    const productsData = await apiService.getFilteredProducts({});
    const products = productsData.body.results;

    const productsWithSortName = await apiService.getFilteredProducts({
      sortProps: { direction: 'asc', value: 'name' },
    });

    products.sort((a, b) => getProductName(a.name).localeCompare(getProductName(b.name)));

    products.forEach(({ name }, index) => {
      expect(productsWithSortName.body.results[index].name).toStrictEqual(name);
    });
  });

  test('check sort products by price', async () => {
    const productsData = await apiService.getFilteredProducts({});
    const products = productsData.body.results;

    const productsWithSortPrice = await apiService.getFilteredProducts({
      sortProps: { direction: 'desc', value: 'price' },
    });

    products.sort(
      (a, b) =>
        (getProductDiscount(b.masterVariant) ?? getProductPrice(b.masterVariant) ?? 0) -
        (getProductDiscount(a.masterVariant) ?? getProductPrice(a.masterVariant) ?? 0),
    );

    products.forEach(({ masterVariant }, index) => {
      expect(getProductPrice(productsWithSortPrice.body.results[index].masterVariant)).toEqual(
        getProductPrice(masterVariant),
      );
    });
  });
});
