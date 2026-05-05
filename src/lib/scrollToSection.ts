export const scrollToSection = (id: string, afterScroll?: () => void) => {
  afterScroll?.();

  const getTargetTop = () => {
    const element = document.getElementById(id);
    if (!element) return null;

    const header = document.querySelector('header');
    const headerOffset =
      header instanceof HTMLElement ? header.offsetHeight + 16 : 96;

    return Math.max(
      0,
      element.getBoundingClientRect().top + window.scrollY - headerOffset
    );
  };

  let attempt = 0;

  const run = () => {
    const targetTop = getTargetTop();
    if (targetTop === null) return;

    window.scrollTo({
      top: targetTop,
      behavior: attempt === 0 ? 'smooth' : 'auto',
    });

    attempt += 1;

    if (attempt < 6) {
      window.setTimeout(run, attempt === 1 ? 500 : 250);
    }
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      run();
    });
  });
};