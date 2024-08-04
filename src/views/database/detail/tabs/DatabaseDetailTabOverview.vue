<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DataSourceDetailTabOverview',
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="database-detail-tab-overview">
    <cl-database-form readonly />
  </div>
</template>

<style lang="scss" scoped>
.database-detail-tab-overview {
  margin: 20px;
}
</style>
