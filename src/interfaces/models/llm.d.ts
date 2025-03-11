export declare global {
  type LLMProviderKey =
    | 'openai'
    | 'azure-openai'
    | 'anthropic'
    | 'gemini'
    | 'grok'
    | 'qwen'
    | 'deepseek'
    | 'mistral'
    | 'openai-compatible';

  interface LLMProvider extends BaseModel {
    key?: LLMProviderKey;
    name?: string;
    enabled?: boolean;
    api_key?: string;
    api_base_url?: string;
    deployment_name?: string;
    api_version?: string;
    models?: string[];
  }

  interface LLMProviderItem {
    key: LLMProviderKey;
    name: string;
    icon?: Icon;
    defaultModels?: string[];
    defaultApiVersions?: string[];
  }

  type ChatMessageType = {
    role: 'system' | 'user';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
  };

  interface ChatRequest {
    provider: string;
    model: string;
    prompt: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    other_params?: Record<string, any>;
  }

  interface ChatbotConfig {
    provider?: LLMProviderKey;
    model?: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }
}
