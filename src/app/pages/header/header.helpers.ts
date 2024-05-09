import { Anchor } from 'globalTypes/elements';
import { PagesPaths } from 'pages/pageWrapper.consts';
import { a } from 'shared/tags/tags.component';

export function getNavLink(title: string, path: PagesPaths): Anchor {
  const homeLink = a({ text: title, href: path });
  homeLink.setAttribute('data-navigo', '');

  return homeLink;
}
