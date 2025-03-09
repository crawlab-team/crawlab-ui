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
      };
      history: string;
      add: string;
    };
  }
} 