import { PagesPaths } from 'pages/pageWrapper.consts';
import { getNavLink } from 'pages/pageWrapper.helpers';
import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import sharedStyles from 'pages/shared/styles/formElements.module.scss';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';

import styles from './notFound.module.scss';

export class NotFound extends BaseComponent {
  constructor() {
    super(
      { className: styles.notFound },
      new SectionTitle('Page not found'),
      div(
        { className: styles.mainLink },
        getNavLink('Go to Main', PagesPaths.HOME, sharedStyles.formFooterLink),
      ),
    );
  }
}
