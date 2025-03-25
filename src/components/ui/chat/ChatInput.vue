<script setup lang="ts">
import { ref, nextTick, onMounted, watch, computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getLLMProviderIcon, getLLMProviderName } from '@/utils/ai';
import ClLabelButton from '@/components/ui/button/LabelButton.vue';

// Add TypeScript interface for tree node
interface TreeNode {
  label: string;
  value: string;
  children?: TreeNode[];
}

const { t } = useI18n();
const userInput = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Accept loading state from parent
const props = defineProps<{
  isLoading?: boolean;
  providers?: LLMProvider[];
  selectedProvider?: LLMProviderKey;
  selectedModel?: string;
}>();

const emit = defineEmits<{
  (e: 'send', message: string): void;
  (e: 'model-change', value: { provider: string; model: string }): void;
  (e: 'cancel'): void;
  (e: 'add-model'): void;
}>();

const selectedProviderModel = ref<string>();
const updateSelectedProviderModel = () => {
  selectedProviderModel.value = `${props.selectedProvider}:${props.selectedModel}`;
};
watch(
  () => `${props.selectedProvider}:${props.selectedModel}`,
  updateSelectedProviderModel
);

const onModelChange = (value: string) => {
  const [provider, model] = value.split(':');
  emit('model-change', { provider, model });
};

const providerSelectOptions = computed<SelectOption[]>(() => {
  return (
    props.providers?.map(provider => {
      const providerName = getLLMProviderName(provider.key!);
      return {
        label: providerName,
        value: provider.key,
        children:
          provider.models?.map(model => ({
            label: model,
            value: `${provider.key}:${model}`,
          })) || [],
      };
    }) || []
  );
});

const adjustTextareaHeight = () => {
  if (!textareaRef.value) return;

  // Reset height to calculate properly
  textareaRef.value.style.height = '0px';

  // Set the height based on scrollHeight
  const scrollHeight = textareaRef.value.scrollHeight;

  // If scrollHeight exceeds max-height (200px), set to max and show scrollbar
  // Otherwise set to exact scrollHeight for auto-height behavior
  const maxHeight = 200;
  if (scrollHeight > maxHeight) {
    textareaRef.value.style.height = `${maxHeight}px`;
    textareaRef.value.style.overflowY = 'auto';
  } else {
    textareaRef.value.style.height = `${scrollHeight}px`;
    textareaRef.value.style.overflowY = 'hidden';
  }
};

// Watch for changes to userInput and adjust height after Vue updates the DOM
watch(userInput, () => {
  nextTick(adjustTextareaHeight);
});

const sendMessage = () => {
  if (!userInput.value.trim() || props.isLoading) return;

  emit('send', userInput.value);
  userInput.value = '';

  // Reset textarea height after sending
  nextTick(() => {
    adjustTextareaHeight();
    if (textareaRef.value) {
      textareaRef.value.focus();
    }
  });
};

const handleKeydown = (e: KeyboardEvent) => {
  // Send on Enter without Shift key
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

onMounted(() => {
  if (textareaRef.value) {
    textareaRef.value.focus();

    // Initial height adjustment
    nextTick(adjustTextareaHeight);
  }

  // Add window resize listener to readjust height
  window.addEventListener('resize', adjustTextareaHeight);
});

// Cleanup event listener on component unmount
onUnmounted(() => {
  window.removeEventListener('resize', adjustTextareaHeight);
});

// For popover visibility control
const popoverVisible = ref(false);

// Get current model display name
const currentModelDisplay = computed(() => {
  if (!selectedProviderModel.value)
    return t('components.ai.chatbot.selectModel');

  const [_, modelName] = selectedProviderModel.value.split(':');

  return modelName || '';
});

// Add focus method
const focus = () => {
  textareaRef.value?.focus();
};

const inputBoxDisabled = computed(() => {
  return props.isLoading || props.providers?.length === 0;
});

const hasProviders = computed(() => {
  return !!props.providers?.length;
});

// Expose focus method
defineExpose({ focus });

defineOptions({ name: 'ClChatInput' });
</script>

<template>
  <div class="chat-input">
    <div class="input-container" :class="{ disabled: inputBoxDisabled }">
      <textarea
        ref="textareaRef"
        v-model="userInput"
        class="message-textarea"
        :placeholder="t('components.ai.chatbot.inputPlaceholder')"
        @input="adjustTextareaHeight"
        @keydown="handleKeydown"
        :disabled="inputBoxDisabled"
        rows="1"
      />
    </div>

    <div class="input-footer">
      <div class="left-content">
        <div v-if="hasProviders" class="model-select-wrapper">
          <el-popover
            placement="top"
            :width="280"
            trigger="click"
            v-model:visible="popoverVisible"
            popper-class="model-select-popover"
          >
            <template #reference>
              <div class="model-select-trigger">
                <cl-icon :icon="getLLMProviderIcon(selectedProvider!)" />
                <span class="model-name">{{ currentModelDisplay }}</span>
                <cl-icon
                  :icon="['fa', 'angle-down']"
                  class="arrow-icon"
                  :class="{ 'is-active': popoverVisible }"
                />
              </div>
            </template>

            <!-- Model selection content inside popover -->
            <div class="model-select-container">
              <el-tree
                :data="providerSelectOptions"
                node-key="value"
                :expand-on-click-node="false"
                @node-click="
                  (data: TreeNode) => {
                    if (data.children?.length) return;
                    selectedProviderModel = data.value;
                    onModelChange(data.value);
                    popoverVisible = false;
                  }
                "
                default-expand-all
              >
                <template #default="{ data }">
                  <span
                    class="model-tree-node"
                    :class="{
                      'is-selected': selectedProviderModel === data.value,
                    }"
                  >
                    {{ data.label }}
                  </span>
                </template>
              </el-tree>
            </div>
          </el-popover>
        </div>
        <div v-else>
          <cl-label-button
            :label="t('components.ai.chatbot.addModel.label')"
            :tooltip="t('components.ai.chatbot.addModel.tooltip')"
            :icon="['fas', 'plus']"
            type="text"
            size="small"
            @click="() => emit('add-model')"
          />
        </div>
      </div>
      <div class="right-content">
        <!-- Cancel button when request is loading -->
        <cl-label-button
          v-if="props.isLoading"
          type="info"
          plain
          size="small"
          :icon="['fas', 'stop-circle']"
          :label="t('common.actions.stop')"
          @click="emit('cancel')"
        />
        <!-- Send button when no request is loading -->
        <cl-label-button
          v-else
          type="text"
          size="small"
          :class="{ 'send-button-active': userInput.trim() }"
          :label="t('common.actions.send') + ' ⏎'"
          @click="sendMessage"
          :disabled="!userInput.trim() || props.isLoading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-input {
  padding: 6px 12px 6px;
  border-top: 1px solid var(--el-border-color);
  background-color: var(--el-bg-color);
  display: flex;
  flex-direction: column;
}

.input-container {
  position: relative;
  display: flex;
  background-color: var(--el-bg-color);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  overflow: hidden;

  &.disabled {
    textarea {
      cursor: not-allowed;
    }
  }
}

.message-textarea {
  flex: 1;
  min-height: 24px;
  max-height: 200px;
  padding: 6px 12px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  color: var(--el-text-color-primary);
  box-sizing: border-box;
  /* Scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: var(--el-border-color-darker) transparent;
}

/* Webkit scrollbar styling */
.message-textarea::-webkit-scrollbar {
  width: 6px;
}

.message-textarea::-webkit-scrollbar-track {
  background: transparent;
}

.message-textarea::-webkit-scrollbar-thumb {
  background-color: var(--el-border-color-darker);
  border-radius: 6px;
}

.message-textarea::placeholder {
  color: var(--el-text-color-placeholder);
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.send-button-active {
  color: var(--el-color-primary);
}

.send-button:hover:not(:disabled) {
  color: var(--el-color-primary);
  transform: scale(1.05);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
  padding: 0 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);

  .left-content {
    flex: 1;
  }
}

.model-select-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  color: var(--el-text-color-regular);
  transition: all 0.2s;
  width: auto;

  &:deep(.arrow-icon) {
    transition: transform 0.3s ease;
    font-size: 12px;
  }

  &:not(:hover):deep(.arrow-icon) {
    color: var(--el-text-color-placeholder);
  }

  &:deep(.arrow-icon.is-active) {
    transform: rotate(180deg);
  }
}

.model-select-trigger:hover {
  border-color: var(--el-color-primary-light-7);
  color: var(--el-color-primary);
}

.model-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trigger-icon {
  font-size: 12px;
}

.model-select-container {
  max-height: 300px;
  overflow-y: auto;
}

.model-tree-node {
  display: block;
  padding: 4px 0;
}

.model-tree-node.is-selected {
  color: var(--el-color-primary);
  font-weight: bold;
}

.shortcut-hint {
  font-style: italic;
}

.powered-by {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ai-icon {
  font-size: 10px;
}

@media (max-width: 768px) {
  .shortcut-hint {
    display: none;
  }
}
</style>
