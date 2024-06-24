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
  <div class="project-detail-tab-overview">
    <cl-project-form />
  </div>
</template>

<style lang="scss" scoped>
.project-detail-tab-overview {
  margin: 20px;
}
</style>