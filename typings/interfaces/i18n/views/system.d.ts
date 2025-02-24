interface LViewsSystem {
  menuItems: {
    customize: string;
    dependency: string;
  };
  customize: {
    customTitle: string;
    showCustomTitle: string;
    customLogo: string;
    showCustomLogo: string;
    hidePlatformVersion: string;
    uploadLogoTip: string;
    uploadLogoErrors: {
      invalidFileType: string;
      fileSizeExceeded: string;
    };
  };
  dependency: {
    autoInstall: string;
  };
}
