<script setup lang="ts">
import useGitDetail from '@/views/git/detail/useGitDetail';

const ns = 'spider';
const { activeId } = useGitDetail();
</script>

<template>
  <cl-file-actions :ns="ns" :active-id="activeId" />
</template>

<style scoped lang="scss"></style>
