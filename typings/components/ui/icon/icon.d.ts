declare const useIcon: () => {
  isFaIcon: (icon: Icon) => boolean;
  isSvg: (icon: Icon) => boolean;
  getFontSize: (size: IconSize) => string;
};
export default useIcon;
