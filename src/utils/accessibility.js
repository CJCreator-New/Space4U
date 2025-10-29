export const announce = (message, priority = 'polite') => {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', priority);
  el.setAttribute('aria-atomic', 'true');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  el.style.width = '1px';
  el.style.height = '1px';
  el.style.overflow = 'hidden';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => document.body.removeChild(el), 1000);
};

export const srOnlyStyles = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0
};
