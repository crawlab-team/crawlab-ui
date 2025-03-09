import useRequest from '@/services/request';

const { get, post } = useRequest();

// LLM Provider interface
export interface LLMProvider {
  name: string;
  features: string[];
  default_models: string[];
}

// Chat request interface
export interface ChatRequest {
  provider: string;
  config?: Record<string, string>;
  model: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  other_params?: Record<string, any>;
}

// Chat response interface
export interface ChatResponse {
  text: string;
  model: string;
  usage?: Record<string, any>;
  error?: string;
}

// Chat response chunk interface
export interface ChatResponseChunk {
  text: string;
  model?: string;
  is_done: boolean;
  error?: string;
  full_text?: string;
  usage?: Record<string, any>;
}

// Get all available LLM providers
export const getLLMProviders = async (): Promise<LLMProvider[]> => {
  return get('/ai/llm/providers');
};

// Check if a provider supports a specific feature
export const checkProviderFeatureSupport = async (
  provider: string,
  feature: string,
  config?: Record<string, string>
): Promise<boolean> => {
  const configParam = config
    ? `&config=${encodeURIComponent(JSON.stringify(config))}`
    : '';
  const response = await get(
    `/ai/llm/providers/${provider}/supports?feature=${feature}${configParam}`
  );
  return response.data.supported;
};

// Send a chat request to an LLM provider
export const sendChatRequest = async (
  chatRequest: ChatRequest
): Promise<ChatResponse> => {
  return post('/ai/chat', chatRequest);
};

// Send a streaming chat request to an LLM provider
export const sendStreamingChatRequest = async (
  chatRequest: ChatRequest,
  onChunk: (chunk: ChatResponseChunk) => void,
  onError: (error: any) => void,
  onComplete: () => void
): Promise<void> => {
  try {
    // Create EventSource connection for SSE
    const body = JSON.stringify(chatRequest);
    const url = `${process.env.VUE_APP_API_BASE_URL || ''}/ai/chat/stream`;

    // We need to create a fetch request with the body since EventSource doesn't support POST bodies
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include auth header if needed
        ...(localStorage.getItem('token')
          ? {
              Authorization: `${localStorage.getItem('token')}`,
            }
          : {}),
      },
      body,
    });

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    // Create a reader from the response body stream
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // Process the stream
    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Stream is complete
            onComplete();
            break;
          }

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages in the buffer
          let delimiterIndex;
          while ((delimiterIndex = buffer.indexOf('\n\n')) >= 0) {
            const message = buffer.slice(0, delimiterIndex);
            buffer = buffer.slice(delimiterIndex + 2);

            // Parse the SSE message
            const lines = message.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                try {
                  const parsedData = JSON.parse(data);
                  onChunk(parsedData);
                } catch (e) {
                  console.error('Error parsing SSE data:', e);
                }
              } else if (line.startsWith('event: error')) {
                // Handle error events
                onError(new Error('Stream error from server'));
              }
            }
          }
        }
      } catch (err) {
        onError(err);
      }
    };

    // Start processing the stream
    processStream();
  } catch (error) {
    onError(error);
  }
};
