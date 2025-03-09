export declare global {
  interface LangAi {
    chatbot: {
      title: string;
      tooltip: string;
      inputPlaceholder: string;
      button: string;
      config: {
        title: string;
        llmProvider: string;
        systemPrompt: string;
        selectProvider: string;
        enterSystemPrompt: string;
        model: string;
        selectModel: string;
        apiKey: string;
        enterApiKey: string;
        temperature: string;
        maxTokens: string;
      };
      history: string;
      add: string;
      enterHint: string;
      poweredBy: string;
    };
  }
} 