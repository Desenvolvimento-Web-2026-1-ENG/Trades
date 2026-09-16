export function createRectCache(element: HTMLElement) {
  let current = element.getBoundingClientRect();

  const update = () => {
    current = element.getBoundingClientRect();
  };

  window.addEventListener('resize', update);
  window.addEventListener('scroll', update, { passive: true });

  const observer = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver(update)
    : null;

  observer?.observe(element);

  return {
    get current() {
      return current;
    },
    destroy() {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
      observer?.disconnect();
    }
  };
}
