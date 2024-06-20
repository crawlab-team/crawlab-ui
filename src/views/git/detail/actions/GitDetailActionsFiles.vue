<script setup lang="ts">
defineOptions({ name: 'ClGitDetailActionsFiles' });
import useGitDetail from '@/views/git/detail/useGitDetail';

const ns = 'git';
const { activeId } = useGitDetail();
</script>

<template>
  <cl-file-actions :ns="ns" :active-id="activeId" />
</template>

<style scoped lang="scss"></style>
