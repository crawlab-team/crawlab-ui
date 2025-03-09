<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import useRequest from '@/services/request';
import { getLLMProviderOptions } from '@/utils/ai';

const { get } = useRequest();

const getLLMProviders = async () => {
  const res = await get('/ai/llm/providers');
  return res.data;
};

const llmProviders = ref<LLMProvider[]>([]);

const form = ref<LLMProvider>({
  key: 'openai',
  name: '',
  api_key: '',
  api_base_url: '',
  enabled: true,
  priority: 0,
  config_schema: '',
  default_config: '',
});


const llmProviderOptions = computed(() => {
  return getLLMProviderOptions();
});

onBeforeMount(async () => {
  llmProviders.value = await getLLMProviders();
});

defineOptions({ name: 'ClSystemDetailTabAi' });
</script>

<template>
  <div class="ai-container">
    <cl-form class="form">
      <cl-form-item :label="$t('views.system.ai.llmProvider')" :span="4">
        <el-select v-model="form.key">
          <el-option v-for="option in llmProviderOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </cl-form-item>
      <cl-form-item :label="$t('views.system.ai.apiKey')" :span="4">
        <el-input v-model="form.api_key" />
      </cl-form-item>
      <cl-form-item v-if="form.key === 'azure-openai'" :label="$t('views.system.ai.apiBaseUrl')" :span="4">
        <el-input v-model="form.api_base_url" />
      </cl-form-item>
    </cl-form>
  </div>
</template>

<style scoped>
.ai-container {
  width: 100%;
  padding: 20px;
}
</style>
