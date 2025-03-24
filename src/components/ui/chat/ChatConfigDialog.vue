<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  visible: boolean;
  providers?: LLMProvider[];
  currentConfig: ChatbotConfig;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', config: ChatbotConfig): void;
}>();

// Form data
const form = ref<ChatbotConfig>({ ...props.currentConfig });
watch(
  () => JSON.stringify(props.currentConfig),
  () => {
    form.value = { ...props.currentConfig };
  }
);

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

defineOptions({ name: 'ClChatConfigDialog' });
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
