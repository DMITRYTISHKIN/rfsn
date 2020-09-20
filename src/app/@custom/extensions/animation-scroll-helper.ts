const easingEquations = {
  easeOutSine: (pos) => {
    return Math.sin(pos * (Math.PI / 2));
  },
  easeInOutSine: (pos) => {
    return -0.5 * (Math.cos(Math.PI * pos) - 1);
  },
  easeInOutQuint: (pos) => {
    if ((pos /= 0.5) < 1) {
      return 0.5 * Math.pow(pos, 5);
    }
    return 0.5 * (Math.pow(pos - 2, 5) + 2);
  }
};

export class AnimationScrollHelper {
  public static scrollY(element: any, scrollTargetY: number, speed: number, easing?: string) {
    const scrollY = element.scrollTop;
    let currentTime = 0;

    scrollTargetY = scrollTargetY || 0;
    speed = speed || 100000;
    easing = easing || 'easeOutSine';

    const time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));

    function tick() {
      currentTime += 1 / 60;

      const p = currentTime / time;
      const t = easingEquations[easing](p);

      if (element.scrollTop >= element.scrollHeight - element.offsetHeight) {
        return;
      }

      if (p < 1) {
        window.requestAnimationFrame(tick);

        element.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t);
      } else {
        element.scrollTo(0, scrollTargetY);
      }
    }

    tick();
  }

  public static scrollX(element: HTMLElement, scrollTargetX: number, speed: number, easing?: string) {
    const scrollX = element.scrollLeft;
    let currentTime = 0;

    scrollTargetX = scrollTargetX || 0;
    speed = speed || 100000;
    easing = easing || 'easeOutSine';

    const time = Math.max(0.1, Math.min(Math.abs(scrollX - scrollTargetX) / speed, 0.8));

    function tick() {
      currentTime += 1 / 60;

      const p = currentTime / time;
      const t = easingEquations[easing](p);

      if (p < 1) {
        window.requestAnimationFrame(tick);

        element.scrollTo(scrollX + (scrollTargetX - scrollX) * t, 0);
      } else {
        element.scrollTo(scrollTargetX, 0);
      }
    }

    tick();
  }
}
