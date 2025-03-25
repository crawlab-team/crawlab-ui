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
      new: string;
      enterHint: string;
      poweredBy: string;
      cancel: string;
      generating: string;
      searchHistory: string;
      noConversations: string;
      newChat: string;
      addModel: {
        label: string;
        tooltip: string;
      };
    };
  }
}
