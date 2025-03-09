export const getLLMProviderOptions = (): SelectOption[] => {
    return [
        {
            value: 'openai',  
            label: 'OpenAI',
        },
        {
            value: 'azure-openai',
            label: 'Azure OpenAI',
        },
        {
            value: 'anthropic',   
            label: 'Anthropic',
        },
        {
            value: 'gemini',
            label: 'Gemini',
        },
        {
            value: 'grok',
            label: 'Grok',
        },
        {
            value: 'qwen',
            label: 'Qwen',
        },
        {
            value: 'mistral',
            label: 'Mistral',
        },
        {
            value: 'cohere',
            label: 'Cohere',
        },
        {
            value: 'deepseek',
            label: 'DeepSeek',
        },
        {
            value: 'openai-compatible',
            label: 'OpenAI Compatible',
        },
    ]
};

