const system: LViewsSystem = {
  menuItems: {
    customize: 'Customization',
    dependency: 'Dependencies',
    environment: 'Environment',
    ai: 'AI Assistant',
  },
  ai: {
    llmProvider: 'LLM Provider',
    apiKey: 'API Key',
    apiBaseUrl: 'API Base URL',
    model: 'Model',
    temperature: 'Temperature',
    maxTokens: 'Max Tokens',
    topP: 'Top P',
  },
  customize: {
    customTitle: 'Custom Site Title',
    showCustomTitle: 'Show Custom Site Title',
    customLogo: 'Custom Logo',
    showCustomLogo: 'Show Custom Site Logo',
    hidePlatformVersion: 'Hide Platform Version',
    uploadLogoTip:
      'Support image formats including JPG, PNG, and SVG. File size should be less than 1MB.',
    uploadLogoErrors: {
      invalidFileType: 'Invalid file type',
      fileSizeExceeded: 'File size exceeded',
    },
  },
  dependency: {
    autoInstall: 'Auto Install',
  },
};

export default system;
