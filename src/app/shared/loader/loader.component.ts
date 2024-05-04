import { div } from 'shared/tags/tags.component';
import Wrapper from 'shared/wrapper/wrapper.component';

import styles from './loader.styles.module.scss';

class Loader extends Wrapper {
  constructor() {
    super();

    this.addClass(styles.loader);
    this.append(div({ className: styles.loaderIcon }));
  }
}

export default new Loader();
