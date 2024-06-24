<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TaskDetailTabOverview',
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="task-detail-tab-overview">
    <cl-task-form readonly />
  </div>
</template>

<style lang="scss" scoped>
.task-detail-tab-overview {
  margin: 20px;
}
</style>