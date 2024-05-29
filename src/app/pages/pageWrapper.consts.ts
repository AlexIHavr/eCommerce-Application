import { ProductsCategories } from 'globalConsts/api.const';

export const PRODUCTS_CATEGORIES_VALUES = Object.values(ProductsCategories);

export const enum CatalogParams {
  CATEGORY = 'category',
  ID = 'id',
}

export const enum PagesPaths {
  HOME = '',
  MAIN = 'main',
  CATALOG = 'catalog',
  ABOUT = 'about',
  SIGNUP = 'signup',
  LOGIN = 'login',
  PROFILE = 'profile',
  CATEGORY = `${PagesPaths.CATALOG}/:${CatalogParams.CATEGORY}`,
  PRODUCT = `${PagesPaths.CATEGORY}/:${CatalogParams.ID}`,
}
