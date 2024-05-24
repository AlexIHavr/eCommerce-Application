export enum CategoriesTypes {
  CHAIRS = 'chairs',
  SOFAS = 'sofas',
  BEDS = 'beds',
}

export const CATEGORIES_TYPES_VALUES = Object.values(CategoriesTypes);

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
  CATEGORY = `${PagesPaths.CATALOG}/:${CatalogParams.CATEGORY}`,
  PRODUCT = `${PagesPaths.CATEGORY}/:${CatalogParams.ID}`,
}
