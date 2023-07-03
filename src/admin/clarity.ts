// baidu tongji
export const initClarity = () => {
  if (localStorage.getItem('useStats') !== '0') {
    import('@/assets/js/clarity.js');
  }
};
