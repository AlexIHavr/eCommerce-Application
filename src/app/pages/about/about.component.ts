import { SectionTitle } from 'pages/shared/components/sectionTitle/sectionTitle.component';
import { BaseComponent } from 'shared/base/base.component';

export class About extends BaseComponent {
  constructor() {
    super({}, new SectionTitle('About'));
  }
}
