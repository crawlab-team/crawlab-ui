<script setup lang="ts">
defineOptions({ name: 'ClSpiderDetailActionsFiles' });
import useSpiderDetail from '@/views/spider/detail/useSpiderDetail';

const ns = 'spider';
const { activeId } = useSpiderDetail();
</script>

<template>
  <cl-file-actions :ns="ns" :active-id="activeId" />
</template>

<style lang="scss" scoped></style>
