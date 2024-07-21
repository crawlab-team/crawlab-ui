const useIcon = () => {
  const isFaIcon = (icon: Icon) => {
    if (Array.isArray(icon)) {
      return icon.length > 0 && icon[0].substring(0, 2) === 'fa';
    } else if (typeof icon === 'string') {
      return icon?.substring(0, 2) === 'fa';
    } else {
      return false;
    }
  };

  const isSvg = (icon: Icon) => {
    if (Array.isArray(icon)) {
      return icon.length > 0 && icon[0] === 'svg';
    } else if (typeof icon === 'string') {
      return icon?.startsWith('svg');
    } else {
      return false;
    }
  };

  const getFontSize = (size: IconSize) => {
    switch (size) {
      case 'large':
        return '24px';
      case 'normal':
        return '16px';
      case 'small':
        return '12px';
      case 'mini':
        return '10px';
      default:
        return size || '16px';
    }
  };

  return {
    // public variables and methods
    isFaIcon,
    isSvg,
    getFontSize,
  };
};

export default useIcon;
