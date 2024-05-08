import { Anchor } from 'globalTypes/elements';
import { PagesPaths } from 'pages/pageWrapper.consts';
import { a } from 'shared/tags/tags.component';

export function getNavigoLink(title: string, path: PagesPaths): Anchor {
  const DATA_NAVIGO = 'data-navigo';

  const homeLink = a({ text: title, href: import.meta.env.BASE_URL + path });
  homeLink.setAttribute(DATA_NAVIGO, DATA_NAVIGO);

  return homeLink;
}
