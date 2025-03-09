const system: LViewsSystem = {
  menuItems: {
    customize: '自定义管理',
    dependency: '依赖管理',
    environment: '环境变量',
    ai: 'AI 助手',
  },
  ai: {
    llmProvider: 'LLM 提供商',
    apiKey: 'API 密钥',
    apiBaseUrl: 'API Base URL',
    model: '模型',
    temperature: '温度',
    maxTokens: '最大令牌数',
    topP: 'Top P',
  },
  customize: {
    customTitle: '自定义网站标题',
    showCustomTitle: '显示自定义网站标题',
    customLogo: '自定义 Logo',
    showCustomLogo: '显示自定义 Logo',
    hidePlatformVersion: '隐藏平台版本',
    uploadLogoTip: '支持 JPG、PNG 和 SVG 等图片格式，文件大小应小于 1MB。',
    uploadLogoErrors: {
      invalidFileType: '文件类型无效',
      fileSizeExceeded: '文件大小超过限制',
    },
  },
  dependency: {
    autoInstall: '自动安装',
  },
};

export default system;
