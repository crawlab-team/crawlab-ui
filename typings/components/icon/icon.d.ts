declare const useIcon: () => {
    isFaIcon: (icon: Icon) => boolean;
    isAzure: (icon: Icon) => boolean;
    getFontSize: (size: IconSize) => string;
};
export default useIcon;
