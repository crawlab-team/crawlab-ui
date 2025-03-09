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
    key: LLMProviderKey;
    name?: string;
    description?: string;
    models?: string[];
    apiKey?: string;
    apiBaseUrl?: string;
    enabled: boolean;
    priority?: number;
    configSchema?: string;
    defaultConfig?: string;
  }
}
