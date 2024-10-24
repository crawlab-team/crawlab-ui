<script setup lang="ts">
import useSpiderDetail from '@/views/spider/detail/useSpiderDetail';

const ns = 'spider';
const { activeId } = useSpiderDetail();
defineOptions({ name: 'ClSpiderDetailActionsFiles' });
</script>

<template>
  <cl-file-actions :ns="ns" :active-id="activeId" />
</template>


