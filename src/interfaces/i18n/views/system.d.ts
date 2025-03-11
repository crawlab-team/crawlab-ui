interface LViewsSystem {
  menuItems: {
    customize: string;
    dependency: string;
    environment: string;
    ai: string;
  };
  ai: {
    llmProvider: string;
    enabled: string;
    apiKey: string;
    apiBaseUrl: string;
    deploymentName: string;
    apiVersion: string;
    models: string;
    defaultModels: string;
    customModels: string;
    addCustomModel: string;
    noCustomModels: string;
    modelAlreadyExists: string;
    temperature: string;
    maxTokens: string;
    topP: string;
    unset: string;
    disabled: string;
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
