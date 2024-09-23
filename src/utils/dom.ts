export const updateTitle = (title: string) => {
  const el = window.document.querySelector('title');
  if (!el) return;
  el.innerText = title;
};

export const selectElement = async (
  selector: string,
  retryNum: number = 10,
  duration: number = 100
): Promise<HTMLElement | null> => {
  for (let i = 0; i < retryNum; i++) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element && window.getComputedStyle(element).display !== 'none') {
      return element;
    }
    await new Promise(resolve => setTimeout(resolve, duration));
  }
  return null;
};
