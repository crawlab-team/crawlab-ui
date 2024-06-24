<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SidebarLayout',
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="sidebar-layout">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.sidebar-layout {
  display: flex;
  height: 100%;
}
</style>