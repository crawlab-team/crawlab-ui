<script setup lang="ts">
defineOptions({ name: 'ClNodeDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="node">
    <template #actions>
      <cl-node-detail-actions-common />
    </template>
  </cl-detail-layout>
</template>

<style lang="scss" scoped></style>
