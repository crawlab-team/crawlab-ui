<script setup lang="ts">
import { computed } from 'vue';
import useIcon from '@/components/ui/icon/icon';

const props = withDefaults(
  defineProps<{
    item: MenuItem;
    size: IconSize;
  }>(),
  {
    size: 'default',
  }
);

const { getFontSize } = useIcon();

const fontSize = computed(() => {
  const { size } = props;
  return getFontSize(size);
});
defineOptions({ name: 'ClMenuItemIcon' });
</script>

<template>
  <template v-if="!item || !item.icon">
    <font-awesome-icon
      :icon="['far', 'circle']"
      :style="{ 'font-size': fontSize }"
      class="menu-item-icon"
    />
  </template>
  <template v-else-if="Array.isArray(item.icon)">
    <font-awesome-icon
      :icon="item.icon"
      :style="{ 'font-size': fontSize }"
      class="menu-item-icon"
    />
  </template>
  <template v-else>
    <i
      :class="item.icon"
      :style="{ 'font-size': fontSize }"
      class="menu-item-icon"
    ></i>
  </template>
</template>

<style scoped>
.menu-item-icon {
  width: 20px;
}
</style>
