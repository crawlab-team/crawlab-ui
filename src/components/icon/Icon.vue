<script setup lang="ts">
defineOptions({ name: 'ClIcon' });
import { computed } from 'vue';
import useIcon from '@/components/icon/icon';

const props = withDefaults(
  defineProps<{
    icon: Icon;
    spinning?: boolean;
    size: IconSize;
  }>(),
  {
    size: 'default',
  }
);

const { isFaIcon: _isFaIcon, getFontSize } = useIcon();

const fontSize = computed(() => {
  const { size } = props;
  return getFontSize(size);
});

const isFaIcon = computed<boolean>(() => {
  const { icon } = props;
  if (!icon) return false;
  return _isFaIcon(icon);
});
</script>

<template>
  <template v-if="icon">
    <font-awesome-icon
      v-if="isFaIcon"
      :class="spinning ? 'fa-spin' : ''"
      :icon="icon"
      :style="{ fontSize }"
      class="icon"
    />
    <i
      v-else
      :class="[spinning ? 'fa-spin' : '', icon, 'icon']"
      :style="{ fontSize }"
    />
  </template>
</template>

<style lang="scss" scoped></style>
