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

  type ChatMessageRole = 'system' | 'user' | 'assistant';
  
  type ChatMessageStatus = 'pending' | 'completed' | 'failed';

  interface ChatMessage extends BaseModel {
    conversation_id: string;
    role: ChatMessageRole;
    content: string;
    model?: string;
    tokens?: number;
    status: ChatMessageStatus;
    error?: string;
    metadata?: Record<string, any>;
    created_ts?: string;
    updated_ts?: string;
  }

  type ChatConversationStatus = 'active' | 'archived' | 'deleted';

  interface ChatConversation extends BaseModel {
    title: string;
    description?: string;
    user_id: string;
    model: string;
    status: ChatConversationStatus;
    last_message_at?: string;
    settings?: Record<string, any>;
    tags?: string[];
    messages?: ChatMessage[];
    created_ts?: string;
    updated_ts?: string;
  }

  // Frontend-specific types for UI state
  interface ChatMessageType {
    role: ChatMessageRole;
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
    conversationId?: string;
  }

  interface ChatRequest {
    provider: string;
    model: string;
    prompt: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    other_params?: Record<string, any>;
    conversation_id?: string;
  }

  interface ChatbotConfig {
    provider?: LLMProviderKey;
    model?: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }
}
