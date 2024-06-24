<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NodeDetailTabOverview',
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="node-detail-tab-overview">
    <cl-node-form readonly />
  </div>
</template>

<style lang="scss" scoped>
.node-detail-tab-overview {
  margin: 20px;
}
</style>