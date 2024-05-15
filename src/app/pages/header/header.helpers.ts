import { ActionFunc } from 'globalTypes/actionFunc';
import { Anchor } from 'globalTypes/elements';
import { PagesPaths } from 'pages/pageWrapper.consts';
import { a } from 'shared/tags/tags.component';

export function getNavLink(title: string, path: PagesPaths, onclick?: ActionFunc): Anchor {
  const homeLink = a({ text: title, href: path, onclick });
  homeLink.setAttribute('data-navigo', '');

  return homeLink;
}
