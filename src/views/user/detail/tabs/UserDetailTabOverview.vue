<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProjectDetailTabOverview',
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="user-detail-tab-overview">
    <cl-user-form />
  </div>
</template>

<style lang="scss" scoped>
.user-detail-tab-overview {
  margin: 20px;
}
</style>
