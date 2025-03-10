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
    api_version?: string;
    models?: string[];
  }

  interface LLMProviderItem {
    key: LLMProviderKey;
    name: string;
    icon?: Icon;
    defaultModels?: string[];
  }
}
