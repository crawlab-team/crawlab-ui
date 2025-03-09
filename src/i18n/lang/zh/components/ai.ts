const ai: LangAi = {
  chatbot: {
    title: 'Crawlab AI 助手',
    tooltip: '与 AI 助手聊天',
    inputPlaceholder: '在这里输入您的问题...',
    button: 'AI 助手',
    config: {
      title: 'AI 助手配置',
      llmProvider: 'LLM 提供商',
      systemPrompt: '系统提示词',
      selectProvider: '选择提供商',
      enterSystemPrompt: '输入系统提示词以引导 AI...',
      model: '模型',
      selectModel: '选择模型',
      apiKey: 'API 密钥',
      enterApiKey: '输入您的 API 密钥',
      temperature: '温度',
      maxTokens: '最大令牌数',
    },
    history: '聊天记录',
    add: '新聊天',
    enterHint: '按回车发送，Shift+回车换行',
    poweredBy: '由 Crawlab AI 提供支持',
  },
};

export default ai; 