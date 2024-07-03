<script setup lang="ts">
import useGitDetail from '@/views/git/detail/useGitDetail';

const ns = 'git';
const { activeId } = useGitDetail();
defineOptions({ name: 'ClGitDetailActionsFiles' });
</script>

<template>
  <cl-file-actions :ns="ns" :active-id="activeId" />
</template>

<style scoped lang="scss"></style>
