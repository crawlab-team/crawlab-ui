<script setup lang="ts">
import { ref, computed, watch, onBeforeMount } from 'vue';
import { ElMessage } from 'element-plus';
import { getLLMProviderItems } from '@/utils/ai';
import useRequest from '@/services/request';
import { translate } from '@/utils';
import { debounce } from 'lodash';

const t = translate;

const { get, post, put } = useRequest();

const formRef = ref();
const form = ref<LLMProvider>({
  enabled: true,
  models: [],
});

const llmProviders = ref<LLMProvider[]>([]);
const llmProvidersDict = computed(() => {
  return llmProviders.value.reduce(
    (acc, cur) => {
      acc[cur.key!] = cur;
      return acc;
    },
    {} as Record<string, LLMProvider>
  );
});

const getLLMProviderList = async () => {
  const res = await get('/ai/llm/providers');
  llmProviders.value = res.data || [];
};

const getLLMProvider = async (key: LLMProviderKey) => {
  const res = await get(`/ai/llm/providers/${key}`);
  form.value = res.data;
  await getLLMProviderList();
};

const saveLLMProvider = debounce(async () => {
  await formRef.value?.validate();
  const exists = !!llmProvidersDict.value[activeLLMProviderKey.value];
  if (exists) {
    await put(`/ai/llm/providers/${activeLLMProviderKey.value}`, {
      data: form.value,
    });
  } else {
    await post('/ai/llm/providers', { data: form.value });
  }
  ElMessage.success(t('common.message.success.save'));
  await getLLMProviderList();
});

const llmProviderItems = computed(() => {
  return getLLMProviderItems();
});

const llmProviderOptions = computed<SelectOption[]>(() => {
  return llmProviderItems.value
    ?.map(({ key, name, icon }) => {
      const llmProvider = llmProvidersDict.value[key];
      return {
        value: key,
        label: name,
        icon: icon,
        disabled: !llmProvider?.enabled,
        unset: !llmProvider || !llmProvider.api_key,
      };
    })
    .sort((a, b) => {
      // Rank providers that are set and enabled first
      if (!a.unset && !a.disabled && (b.unset || b.disabled)) return -1;
      if ((a.unset || a.disabled) && !b.unset && !b.disabled) return 1;
      // Then rank providers that are set but disabled
      if (!a.unset && a.disabled && b.unset) return -1;
      if (a.unset && !b.unset && b.disabled) return 1;
      // Then keep original order
      return 0;
    });
});

const activeLLMProviderKey = ref<LLMProviderKey>(
  localStorage.getItem('activeLLMProviderKey') ||
    llmProviderOptions.value[0].value
);
const updateLLMProvider = async () => {
  if (llmProvidersDict.value[activeLLMProviderKey.value]) {
    await getLLMProvider(activeLLMProviderKey.value);
  } else {
    form.value = {
      key: activeLLMProviderKey.value,
      enabled: true,
      models: [],
    };
  }
};
watch(activeLLMProviderKey, async newKey => {
  if (newKey) {
    localStorage.setItem('activeLLMProviderKey', newKey);
    await updateLLMProvider();
  }
});

const activeLLMProvider = computed(() => {
  return llmProviderItems.value.find(p => p.key === activeLLMProviderKey.value);
});

const showApiBaseUrl = computed(() => {
  return ['azure-openai', 'openai-compatible'].includes(
    activeLLMProviderKey.value
  );
});

const showDeploymentName = computed(() => {
  return ['azure-openai'].includes(activeLLMProviderKey.value);
});

const showApiVersion = computed(() => {
  return ['azure-openai'].includes(activeLLMProviderKey.value);
});

// Models functionality
const defaultModels = computed(() => {
  return activeLLMProvider.value?.defaultModels || [];
});

const defaultApiVersion = computed(() => {
  return activeLLMProvider.value?.defaultApiVersions?.[0] || '';
});

const customModelInput = ref('');
const customModels = computed(() => {
  // Get models that are not in defaultModels
  return (form.value.models || []).filter(
    model => !defaultModels.value.includes(model)
  );
});

const addCustomModel = () => {
  if (!customModelInput.value.trim()) return;

  // If model already exists, don't add it again
  if ((form.value.models || []).includes(customModelInput.value.trim())) {
    ElMessage.warning(t('views.system.ai.modelAlreadyExists'));
    return;
  }

  // Initialize models array if it doesn't exist
  if (!form.value.models) {
    form.value.models = [];
  }

  // Add the custom model
  form.value.models.push(customModelInput.value.trim());
  customModelInput.value = '';
  saveLLMProvider();
};

const removeCustomModel = (model: string) => {
  if (!form.value.models) return;

  const index = form.value.models.indexOf(model);
  if (index !== -1) {
    form.value.models.splice(index, 1);
    saveLLMProvider();
  }
};

const isModelEnabled = (model: string) => {
  return (form.value.models || []).includes(model);
};

const toggleModel = (model: string) => {
  if (!form.value.models) {
    form.value.models = [];
  }

  const index = form.value.models.indexOf(model);
  if (index === -1) {
    // Enable model
    form.value.models.push(model);
  } else {
    // Disable model
    form.value.models.splice(index, 1);
  }

  saveLLMProvider();
};

// Initialize models from default models if needed
const initializeDefaultModels = () => {
  if (!form.value.models?.length && defaultModels.value.length > 0) {
    form.value.models = [...defaultModels.value];
  }
};

const initializeDefaultApiVersion = () => {
  if (!form.value.api_version && defaultApiVersion.value) {
    form.value.api_version = defaultApiVersion.value;
  }
};

watch(
  () => activeLLMProvider.value,
  () => {
    initializeDefaultModels();
    initializeDefaultApiVersion();
  },
  { immediate: true }
);

onBeforeMount(async () => {
  await getLLMProviderList();
  await updateLLMProvider();
  initializeDefaultModels();
  initializeDefaultApiVersion();
});

defineOptions({ name: 'ClSystemDetailTabAi' });
</script>

<template>
  <div class="ai-container">
    <el-menu class="menu" :default-active="activeLLMProviderKey">
      <el-menu-item
        v-for="op in llmProviderOptions"
        :key="op.value"
        :index="op.value"
        :class="op.disabled ? 'disabled' : ''"
        @click="activeLLMProviderKey = op.value"
      >
        <cl-icon :icon="op.icon" />
        <span class="label">
          {{ op.label }}
        </span>
        <span class="info">
          {{
            op.unset
              ? ' (' + $t('views.system.ai.unset') + ')'
              : op.disabled
                ? ' (' + $t('views.system.ai.disabled') + ')'
                : ''
          }}
        </span>
      </el-menu-item>
    </el-menu>
    <cl-form
      class="form"
      ref="formRef"
      :model="form"
      :key="activeLLMProviderKey"
    >
      <cl-form-item :label="$t('views.system.ai.llmProvider')" :span="4">
        <cl-icon :icon="activeLLMProvider?.icon" />
        {{ activeLLMProvider?.name }}
      </cl-form-item>
      <cl-form-item :label="$t('views.system.ai.enabled')" :span="4">
        <cl-switch v-model="form.enabled" @change="saveLLMProvider" />
      </cl-form-item>
      <cl-form-item :label="$t('views.system.ai.apiKey')" :span="4" required>
        <cl-edit-input
          v-model="form.api_key"
          :display-value="
            form.api_key ? '*'.repeat(Math.min(form.api_key.length, 10)) : ''
          "
          @change="saveLLMProvider"
        />
      </cl-form-item>
      <cl-form-item
        v-if="showApiBaseUrl"
        :label="$t('views.system.ai.apiBaseUrl')"
        :span="4"
        prop="api_base_url"
        required
      >
        <cl-edit-input v-model="form.api_base_url" @change="saveLLMProvider" />
      </cl-form-item>
      <cl-form-item
        v-if="showDeploymentName"
        :label="$t('views.system.ai.deploymentName')"
        :span="4"
        prop="deployment_name"
        required
      >
        <cl-edit-input
          v-model="form.deployment_name"
          @change="saveLLMProvider"
        />
      </cl-form-item>
      <cl-form-item
        v-if="showApiVersion"
        :label="$t('views.system.ai.apiVersion')"
        :span="4"
        prop="api_version"
      >
        <cl-edit-input v-model="form.api_version" @change="saveLLMProvider" />
      </cl-form-item>
      <cl-form-item
        :label="$t('views.system.ai.models')"
        :span="4"
        prop="models"
      >
        <div class="models-section">
          <!-- Default models from provider -->
          <div v-if="defaultModels.length > 0" class="default-models">
            <div class="section-title">
              {{ $t('views.system.ai.defaultModels') }}
            </div>
            <div class="model-list">
              <el-checkbox
                v-for="model in defaultModels"
                :key="model"
                :model-value="isModelEnabled(model)"
                @change="() => toggleModel(model)"
                class="model-checkbox"
              >
                {{ model }}
              </el-checkbox>
            </div>
          </div>

          <!-- Custom models -->
          <div class="custom-models">
            <div class="section-title">
              {{ $t('views.system.ai.customModels') }}
            </div>

            <!-- Add custom model input -->
            <div class="add-model">
              <el-input
                v-model="customModelInput"
                :placeholder="$t('views.system.ai.addCustomModel')"
                @keyup.enter="addCustomModel"
              >
                <template #append>
                  <cl-fa-icon-button
                    @click="addCustomModel"
                    :icon="['fa', 'plus']"
                  />
                </template>
              </el-input>
            </div>

            <!-- Custom model list -->
            <div v-if="customModels.length > 0" class="model-list">
              <div
                v-for="model in customModels"
                :key="model"
                class="custom-model-item"
              >
                <el-checkbox
                  :model-value="isModelEnabled(model)"
                  @change="() => toggleModel(model)"
                >
                  {{ model }}
                </el-checkbox>
                <span class="delete-btn" @click="removeCustomModel(model)">
                  <cl-icon :icon="['fa', 'times']" />
                </span>
              </div>
            </div>
            <div v-else class="no-custom-models">
              {{ $t('views.system.ai.noCustomModels') }}
            </div>
          </div>
        </div>
      </cl-form-item>
    </cl-form>
  </div>
</template>

<style scoped>
.ai-container {
  width: 100%;
  display: flex;

  .form {
    display: block;
    width: 100%;
    padding: 12px 24px;
  }

  &:deep(.el-menu) {
    flex: 0 0 180px;

    .el-menu-item {
      &:hover {
        background-color: inherit !important;
        color: var(--cl-primary-color);
      }

      &:deep(.icon) {
        width: 24px;
      }

      &:not(:hover):not(.is-active) {
        &.disabled {
          color: var(--el-text-color-secondary);
        }
      }

      .label {
        margin-right: 3px;
      }

      .info {
        font-size: 11px;
      }
    }
  }

  .models-section {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .section-title {
      font-weight: 600;
      margin-bottom: 8px;
    }

    .model-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .model-checkbox {
        min-width: 200px;
      }
    }

    .custom-models {
      margin-top: 12px;

      .add-model {
        margin-bottom: 12px;
        max-width: 400px;
      }

      .custom-model-item {
        display: flex;
        align-items: center;
        margin-bottom: 4px;

        .el-checkbox {
          flex-grow: 1;
        }

        .delete-btn {
          margin-left: 8px;
          min-width: 32px;
          cursor: pointer;
          color: var(--el-text-color-secondary);
        }
      }

      .no-custom-models {
        color: var(--el-text-color-secondary);
        font-style: italic;
      }
    }
  }
}
</style>
