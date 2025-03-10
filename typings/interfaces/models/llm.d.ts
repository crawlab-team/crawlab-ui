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
    api_key?: string;
    api_base_url?: string;
    api_version?: string;
    enabled?: boolean;
    priority?: number;
    config_schema?: string;
    default_config?: string;
  }

  interface LLMProviderItem {
    key: LLMProviderKey;
    name: string;
    icon?: Icon;
    defaultModels?: string[];
  }
}
