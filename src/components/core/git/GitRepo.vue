<script setup lang="ts">
import { translate } from '@/utils';

defineProps<{
  name?: string;
  gitRootPath?: string;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const t = translate;
defineOptions({ name: 'ClGitRepo' });
</script>

<template>
  <cl-tag
    type="primary"
    :label="name"
    :icon="['fab', 'git']"
    clickable
    @click="emit('click')"
  >
    <template #tooltip>
      <label>{{ t('components.git.spiders.gitRootPath') }}: </label>
      <span v-if="gitRootPath">{{ gitRootPath }}</span>
      <span v-else>~ ({{ t('components.file.rootDirectory') }})</span>
    </template>
  </cl-tag>
</template>
