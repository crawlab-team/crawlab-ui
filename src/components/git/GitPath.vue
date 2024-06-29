<script setup lang="ts">
defineOptions({ name: 'ClGitPath' });

import { translate } from '@/utils';
import { FILE_ROOT } from '@/constants';

const t = translate;
defineProps<{
  path?: string;
}>();
</script>

<template>
  <template v-if="path">{{ path }}</template>
  <template v-else>
    {{ FILE_ROOT }} ({{ t('components.file.rootDirectory') }})
  </template>
</template>

<style scoped lang="scss"></style>
