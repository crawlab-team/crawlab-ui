interface LViewsSystem {
  menuItems: {
    customize: string;
    dependency: string;
    environment: string;
    ai: string;
  };
  ai: {
    llmProvider: string;
    apiKey: string;
    apiBaseUrl: string;
    model: string;
    temperature: string;
    maxTokens: string;
    topP: string;
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
