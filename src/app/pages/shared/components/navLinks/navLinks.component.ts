import { Anchor } from 'globalTypes/elements';
import { PagesPaths } from 'pages/pageWrapper.consts';
import { getNavLink } from 'pages/pageWrapper.helpers';

export const signupNavLink = (className?: string): Anchor =>
  getNavLink('Signup', PagesPaths.SIGNUP, className);
export const loginNavLink = (className?: string): Anchor =>
  getNavLink('Login', PagesPaths.LOGIN, className);
