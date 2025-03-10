export const getLLMProviderItems = (): LLMProviderItem[] => {
  return [
    {
      key: 'openai',
      name: 'OpenAI',
      icon: ['svg', 'openai'],
      defaultModels: [
        'gpt-4o',
        'gpt-4o-mini',
        'o1-mini',
        'o1',
        'o3-mini',
        'o3',
      ],
    },
    {
      key: 'azure-openai',
      name: 'Azure OpenAI',
      icon: ['svg', 'azure'],
      defaultModels: [
        'gpt-4o',
        'gpt-4o-mini',
        'o1-mini',
        'o1',
        'o3-mini',
        'o3',
      ],
    },
    {
      key: 'anthropic',
      name: 'Anthropic',
      icon: ['svg', 'anthropic'],
      defaultModels: [
        'claude-3.7-sonnet',
        'claude-3.7-sonnet-thinking',
        'claude-3.5-sonnet',
      ],
    },
    {
      key: 'gemini',
      name: 'Gemini',
      icon: ['svg', 'gemini'],
    },
    {
      key: 'grok',
      name: 'Grok',
      icon: ['svg', 'grok'],
    },
    {
      key: 'qwen',
      name: 'Qwen',
      icon: ['svg', 'qwen'],
      defaultModels: ['qwen-max', 'qwen-plus', 'qwen-turbo'],
    },
    {
      key: 'mistral',
      name: 'Mistral',
      icon: ['svg', 'mistral'],
    },
    {
      key: 'deepseek',
      name: 'DeepSeek',
      icon: ['svg', 'deepseek'],
    },
    {
      key: 'openai-compatible',
      name: 'OpenAI Compatible',
      icon: ['svg', 'openai'],
    },
  ];
};

export const getLLMProviderOptions = (): SelectOption[] => {
  return getLLMProviderItems().map(({ key, name, icon }) => {
    return {
      value: key,
      label: name,
      icon: icon,
    };
  });
};
