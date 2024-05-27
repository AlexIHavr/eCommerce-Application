import 'swiper/css/bundle';

import { Div } from 'globalTypes/elements';
import { BaseComponent } from 'shared/base/base.component';
import { div } from 'shared/tags/tags.component';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import { SWIPER_CLASSES } from './slider.consts';
import styles from './slider.module.scss';

export class Slider {
  public static init(): Swiper {
    return new Swiper(`.${SWIPER_CLASSES.swiper}`, {
      speed: 600,
      modules: [Navigation, Pagination],
      navigation: {
        nextEl: `.${SWIPER_CLASSES.buttonNext}`,
        prevEl: `.${SWIPER_CLASSES.buttonPrev}`,
      },
      pagination: {
        el: `.${SWIPER_CLASSES.pagination}`,
        clickable: true,
        bulletActiveClass: styles.sliderBullet,
      },
    });
  }

  public static getSliderWrapper(...sliders: BaseComponent[]): Div {
    const buttonPrev = div({ className: SWIPER_CLASSES.buttonPrev });
    buttonPrev.addClass(styles.sliderButton);

    const buttonNext = div({ className: SWIPER_CLASSES.buttonNext });
    buttonNext.addClass(styles.sliderButton);

    return div(
      { className: SWIPER_CLASSES.swiper },
      div(
        { className: 'swiper-wrapper' },
        ...sliders.map((slide) => div({ className: 'swiper-slide' }, slide)),
      ),
      div({ className: SWIPER_CLASSES.pagination }),
      buttonPrev,
      buttonNext,
    );
  }
}
