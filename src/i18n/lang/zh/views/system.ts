const system: LViewsSystem = {
  menuItems: {
    customize: '自定义管理',
    dependency: '依赖管理',
    environment: '环境变量',
    ai: 'AI 助手',
  },
  ai: {
    llmProvider: 'LLM 提供商',
    enabled: '是否启用',
    apiKey: 'API 密钥',
    deploymentName: '部署名称',
    apiBaseUrl: 'API 基础 URL',
    apiVersion: 'API 版本',
    models: '模型',
    defaultModels: '默认模型',
    customModels: '自定义模型',
    addCustomModel: '添加自定义模型',
    noCustomModels: '暂无自定义模型',
    modelAlreadyExists: '模型已存在',
    temperature: '温度',
    maxTokens: '最大令牌数',
    topP: 'Top P',
    unset: '未设置',
    disabled: '已禁用',
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
