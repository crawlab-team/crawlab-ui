const useIcon = () => {
  const isFaIcon = (icon: Icon) => {
    if (Array.isArray(icon)) {
      return icon.length > 0 && icon[0].substring(0, 2) === 'fa';
    } else {
      return icon?.substring(0, 2) === 'fa';
    }
  };

  const isAzure = (icon: Icon) => {
    if (Array.isArray(icon)) {
      return icon.length > 0 && icon[0] === 'azure';
    } else {
      return icon?.startsWith('azure');
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
    isAzure,
    getFontSize,
  };
};

export default useIcon;
