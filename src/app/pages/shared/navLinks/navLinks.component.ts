import { PagesPaths } from 'pages/pageWrapper.consts';

import { getNavigoLink } from './navLinks.helpers';

export const mainNavLink = getNavigoLink('Home', PagesPaths.MAIN);
export const loginNavLink = getNavigoLink('Login', PagesPaths.LOGIN);
export const signupNavLink = getNavigoLink('Signup', PagesPaths.SIGNUP);
