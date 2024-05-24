export const enum CategoriesTypes {
  CHAIRS = 'chairs',
  SOFAS = 'sofas',
  BEDS = 'beds',
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
}
