import { Div } from 'globalTypes/elements.type';
import { a, div, img } from 'shared/tags/tags.component';

import styles from './about.module.scss';

export function getMember(
  photo: string,
  name: string,
  role: string,
  description: string,
  githubLink: string,
): Div {
  return div(
    { className: styles.member },
    img({ className: styles.memberPhoto, src: photo, alt: 'photo' }),
    div({ className: styles.memberName, text: name }),
    div({ className: styles.memberRole, text: role }),
    div({ className: styles.memberDescription, text: description }),
    a({ className: styles.githubLink, href: githubLink, text: 'Github', target: 'blank' }),
  );
}
