<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import useIcon from '@/components/ui/icon/icon';

const props = withDefaults(
  defineProps<{
    icon: Icon;
    spinning?: boolean;
    size?: IconSize;
    color?: string;
  }>(),
  {
    size: 'default',
  }
);

const { isFaIcon: _isFaIcon, isAzure: _isAzure, getFontSize } = useIcon();

const fontSize = computed(() => {
  const { size } = props;
  return getFontSize(size);
});

const isFaIcon = computed<boolean>(() => {
  const { icon } = props;
  if (!icon) return false;
  return _isFaIcon(icon);
});

const isAzure = computed<boolean>(() => {
  const { icon } = props;
  if (!icon) return false;
  return _isAzure(icon);
});

const iconComponent = ref<any>(null);

onMounted(async () => {
  if (isAzure.value) {
    const azureIcons = import.meta.glob('@/assets/svg/icons/azure/*.svg');
    const azureIconPath = `@/assets/svg/icons/azure/${props.icon[1]}.svg`;
    if (azureIcons[azureIconPath]) {
      azureIcons[azureIconPath]().then((module: any) => {
        iconComponent.value = module.default;
      });
    }
  }
});
defineOptions({ name: 'ClIcon' });
</script>

<template>
  <template v-if="icon">
    <font-awesome-icon
      v-if="isFaIcon"
      :class="spinning ? 'fa-spin' : ''"
      :icon="icon"
      :style="{ fontSize, color }"
      class="icon"
    />
    <component v-else-if="isAzure" :is="iconComponent"></component>
    <i
      v-else
      :class="[spinning ? 'fa-spin' : '', icon, 'icon']"
      :style="{ fontSize, color }"
    />
  </template>
</template>

<style lang="scss" scoped></style>
