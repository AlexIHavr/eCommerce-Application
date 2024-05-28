import { Div } from 'globalTypes/elements';
import { Slider } from 'shared/slider/slider.component';
import { div, img } from 'shared/tags/tags.component';

import styles from './product.module.scss';

export function getSlider(images: string[], className?: string): Div {
  const slider = div(
    {},
    Slider.getSliderWrapper(
      ...images.map((image) =>
        img({ className: styles.sliderImage, src: image, alt: `${image}-image` }),
      ),
    ),
  );

  if (className) slider.addClass(className);

  return slider;
}
