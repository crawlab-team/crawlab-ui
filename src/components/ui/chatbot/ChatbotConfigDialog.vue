<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const { t } = useI18n();
const store = useStore();

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', config: ChatbotConfig): void;
}>();

interface ChatbotConfig {
  llmProvider: string;
  systemPrompt: string;
}

// Mock list of LLM providers
// This would typically come from a store or API
const llmProviders = ref([
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'local', label: 'Local Model' },
]);

// Form data
const form = ref<ChatbotConfig>({
  llmProvider: 'openai', // Default value
  systemPrompt: 'You are a helpful AI assistant for Crawlab, a web crawling and data extraction platform.'
});

// Load config from localStorage if available
const loadConfig = () => {
  const storedConfig = localStorage.getItem('chatbotConfig');
  if (storedConfig) {
    try {
      const parsedConfig = JSON.parse(storedConfig);
      form.value = { ...form.value, ...parsedConfig };
    } catch (e) {
      console.error('Failed to parse stored chatbot config', e);
    }
  }
};

// Initialize when the component is visible
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    loadConfig();
  }
});

const confirmLoading = ref(false);

const onConfirm = async () => {
  confirmLoading.value = true;
  try {
    // Save to localStorage for persistence
    localStorage.setItem('chatbotConfig', JSON.stringify(form.value));
    
    // Emit the config to the parent component
    emit('confirm', form.value);
  } finally {
    confirmLoading.value = false;
    emit('close');
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