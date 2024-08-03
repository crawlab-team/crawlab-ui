interface LViewsSystem {
  menuItems: {
    customize: string;
    registration: string;
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
}
