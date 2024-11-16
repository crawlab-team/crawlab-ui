<script setup lang="ts">
import { computed, StyleValue } from 'vue';
import { emptyObjectFunc } from '@/utils/func';

const props = withDefaults(
  defineProps<{
    fileStatus: GitChange;
  }>(),
  {
    fileStatus: emptyObjectFunc,
  }
);

const fileNameStyle = computed<StyleValue>(() => {
  const { fileStatus } = props;
  const { worktree, staging } = fileStatus;
  let label = staging;
  if ([' ', '?'].includes(staging || '')) {
    label = worktree;
  }
  switch (label) {
    case '?':
      return { color: 'var(--cl-danger-color)' };
    case 'M':
      return { color: 'var(--cl-primary-color)' };
    case 'A':
      return { color: 'var(--cl-success-color)' };
    case 'D':
      return {
        color: 'var(--cl-info-medium-color)',
        textDecoration: 'line-through',
      };
    case 'R':
      return { color: 'var(--cl-primary-color)' };
    case 'C':
      return { color: 'var(--cl-primary-color)' };
    case 'U':
      return { color: 'var(--cl-danger-color)' };
    default:
      return {};
  }
});
defineOptions({ name: 'ClGitFileStatus' });
</script>

<template>
  <div class="git-file-status">
    <span class="file-name" :style="fileNameStyle">
      {{ fileStatus.name }}
    </span>
    <span class="file-path">
      {{ fileStatus.path }}
    </span>
  </div>
</template>

<style scoped>
.git-file-status {
  .file-path {
    margin-left: 10px;
    font-size: 11px;
    color: var(--cl-info-medium-light-color);
  }
}
</style>
