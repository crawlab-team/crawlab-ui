const ai: LangAi = {
  chatbot: {
    title: 'Crawlab AI Assistant',
    tooltip: 'Chat with AI Assistant',
    inputPlaceholder: 'Type your question here...',
    button: 'AI Assistant',
    config: {
      title: 'AI Assistant Config',
      llmProvider: 'LLM Provider',
      systemPrompt: 'System Prompt',
      selectProvider: 'Select a provider',
      enterSystemPrompt: 'Enter a system prompt to guide the AI...',
      model: 'Model',
      selectModel: 'Select a model',
      apiKey: 'API Key',
      enterApiKey: 'Enter your API key',
      temperature: 'Temperature',
      maxTokens: 'Max Tokens',
    },
    history: 'Chat History',
    add: 'New Chat',
    enterHint: 'Press Enter to send, Shift+Enter for new line',
    poweredBy: 'Powered by Crawlab AI',
    cancel: 'Cancel',
    generating: 'Generating...',
  },
};

export default ai; 