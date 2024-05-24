export enum CategoriesTypes {
  CHAIRS = 'chairs',
  SOFAS = 'sofas',
  BEDS = 'beds',
}

export const CATEGORIES_TYPES_VALUES = Object.values(CategoriesTypes);

export const enum ProductParams {
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
  CHAIRS = `${PagesPaths.CATALOG}/${CategoriesTypes.CHAIRS}`,
  SOFAS = `${PagesPaths.CATALOG}/${CategoriesTypes.SOFAS}`,
  BEDS = `${PagesPaths.CATALOG}/${CategoriesTypes.BEDS}`,
  PRODUCT = `${PagesPaths.CATALOG}/:${ProductParams.CATEGORY}/:${ProductParams.ID}`,
}
