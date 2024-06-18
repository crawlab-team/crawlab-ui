<template>
  <div class="data-source-detail-tab-overview">
    <cl-data-source-form readonly />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DataSourceDetailTabOverview',
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
.data-source-detail-tab-overview {
  margin: 20px;
}
</style>
