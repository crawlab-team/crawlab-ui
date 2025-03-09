<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const { t } = useI18n();
const store = useStore();

const props = defineProps<{
  visible: boolean;
  providers?: { name: string; features: string[]; default_models: string[] }[];
  currentConfig?: ChatbotConfig;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', config: ChatbotConfig): void;
}>();

interface ChatbotConfig {
  llmProvider: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
}

// Default values
const defaultConfig: ChatbotConfig = {
  llmProvider: 'openai',
  model: 'gpt-3.5-turbo',
  systemPrompt: 'You are a helpful AI assistant for Crawlab, a web crawling and data extraction platform.',
  temperature: 0.7,
  maxTokens: 1000,
};

// Form data
const form = ref<ChatbotConfig>({ ...defaultConfig });

// Computed list of providers with proper labels
const llmProviders = computed(() => {
  if (!props.providers || props.providers.length === 0) {
    // Fallback to basic options if providers aren't provided
    return [
      { value: 'openai', label: 'OpenAI' },
      { value: 'anthropic', label: 'Anthropic' },
      { value: 'gemini', label: 'Google Gemini' },
    ];
  }
  
  return props.providers.map(provider => ({
    value: provider.name,
    label: provider.name.charAt(0).toUpperCase() + provider.name.slice(1),
  }));
});

// Computed list of models based on selected provider
const availableModels = computed(() => {
  if (!props.providers) return [];
  
  const selectedProvider = props.providers.find(p => p.name === form.value.llmProvider);
  if (!selectedProvider || !selectedProvider.default_models) return [];
  
  return selectedProvider.default_models.map(model => ({
    value: model,
    label: model,
  }));
});

// Initialize form when props change
watch(() => props.currentConfig, (newConfig) => {
  if (newConfig) {
    form.value = { ...defaultConfig, ...newConfig };
  } else {
    form.value = { ...defaultConfig };
  }
}, { immediate: true });

// Update model when provider changes
watch(() => form.value.llmProvider, (newProvider) => {
  const provider = props.providers?.find(p => p.name === newProvider);
  if (provider && provider.default_models && provider.default_models.length > 0) {
    form.value.model = provider.default_models[0];
  }
});

const confirmLoading = ref(false);

const onConfirm = async () => {
  confirmLoading.value = true;
  try {
    // Emit the config to the parent component
    emit('confirm', form.value);
  } finally {
    confirmLoading.value = false;
  }
};

const onClose = () => {
  emit('close');
};

defineOptions({ name: 'ClChatbotConfigDialog' });
</script>

<template>
  <cl-dialog
    :title="t('components.ai.chatbot.config.title')"
    :visible="visible"
    width="600px"
    :confirm-loading="confirmLoading"
    @confirm="onConfirm"
    @close="onClose"
  >
    <cl-form :model="form">
      <cl-form-item
        :label="t('components.ai.chatbot.config.llmProvider')"
        prop="llmProvider"
        :span="4"
        required
      >
        <el-select 
          v-model="form.llmProvider" 
          :placeholder="t('components.ai.chatbot.config.selectProvider')"
          style="width: 100%"
        >
          <el-option 
            v-for="provider in llmProviders" 
            :key="provider.value" 
            :label="provider.label" 
            :value="provider.value" 
          />
        </el-select>
      </cl-form-item>
      
      <cl-form-item
        :label="t('components.ai.chatbot.config.model')"
        prop="model"
        :span="4"
        required
      >
        <el-select 
          v-model="form.model" 
          :placeholder="t('components.ai.chatbot.config.selectModel')"
          style="width: 100%"
        >
          <el-option 
            v-for="model in availableModels" 
            :key="model.value" 
            :label="model.label" 
            :value="model.value" 
          />
        </el-select>
      </cl-form-item>
      
      <cl-form-item
        :label="t('components.ai.chatbot.config.apiKey')"
        prop="apiKey"
        :span="4"
      >
        <el-input
          v-model="form.apiKey"
          type="password"
          :placeholder="t('components.ai.chatbot.config.enterApiKey')"
          show-password
        />
      </cl-form-item>
      
      <cl-form-item
        :label="t('components.ai.chatbot.config.temperature')"
        prop="temperature"
        :span="4"
      >
        <el-slider 
          v-model="form.temperature" 
          :min="0" 
          :max="1" 
          :step="0.1" 
          show-input
        />
      </cl-form-item>
      
      <cl-form-item
        :label="t('components.ai.chatbot.config.maxTokens')"
        prop="maxTokens"
        :span="4"
      >
        <el-input-number 
          v-model="form.maxTokens" 
          :min="100" 
          :max="8000" 
          :step="100" 
          style="width: 100%"
        />
      </cl-form-item>
      
      <cl-form-item
        :label="t('components.ai.chatbot.config.systemPrompt')"
        prop="systemPrompt"
        :span="4"
        required
      >
        <el-input
          v-model="form.systemPrompt"
          type="textarea"
          :rows="5"
          :placeholder="t('components.ai.chatbot.config.enterSystemPrompt')"
        />
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>

<style scoped>
.api-key-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}
</style> 