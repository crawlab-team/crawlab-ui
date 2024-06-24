<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NodeDetail',
  setup(props, { emit }) {
    return {};
  },
});
</script>

<template>
  <cl-detail-layout store-namespace="node" />
</template>

<style lang="scss" scoped></style>