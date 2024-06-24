<script>
export default {
  name: 'SimpleLayout',
  props: {
    background: {
      type: String,
      default: '#ffffff',
    },
    padding: {
      type: String,
    },
  },
  setup() {
    return {};
  },
};
</script>

<template>
  <div class="simple-layout" :style="{ background, padding }">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.simple-layout {
  padding: 20px;
  min-height: 100%;
}
</style>
