<script setup lang="ts">
import { ref, computed, onBeforeMount, watch } from 'vue';
import useIcon from '@/components/ui/icon/icon';

const props = withDefaults(
  defineProps<{
    icon: Icon;
    spinning?: boolean;
    size?: IconSize;
    color?: string;
    alt?: string;
  }>(),
  {
    size: 'default',
  }
);

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const { isFaIcon: _isFaIcon, isSvg: _isSvg, getFontSize } = useIcon();

const fontSize = computed(() => {
  const { size } = props;
  return getFontSize(size);
});

const isFaIcon = computed<boolean>(() => {
  const { icon } = props;
  if (!icon) return false;
  return _isFaIcon(icon);
});

const isSvg = computed<boolean>(() => {
  const { icon } = props;
  if (!icon) return false;
  return _isSvg(icon);
});

const iconSvgSrc = ref<string>('');
const updateIconSvgSrc = async () => {
  if (isSvg.value) {
    const { icon } = props;
    if (!Array.isArray(icon) || !icon[1]) return;
    const res = await import(`@/assets/svg/icons/${icon[1]}.svg?url`);
    if (res) {
      iconSvgSrc.value = res.default;
    }
  }
};
onBeforeMount(updateIconSvgSrc);
watch(() => props.icon, updateIconSvgSrc);

defineOptions({ name: 'ClIcon' });
</script>

<template>
  <template v-if="icon">
    <template v-if="isFaIcon">
      <font-awesome-icon
        :class="spinning ? 'fa-spin' : ''"
        :icon="icon"
        :style="{ fontSize, color }"
        class="icon"
        @click="event => emit('click', event)"
      />
    </template>
    <template v-else-if="isSvg">
      <img
        class="icon"
        :src="iconSvgSrc"
        :alt="alt"
        @click="event => emit('click', event)"
      />
    </template>
    <template v-else>
      <i
        :class="[spinning ? 'fa-spin' : '', icon, 'icon']"
        :style="{ fontSize, color }"
        @click="event => emit('click', event)"
      />
    </template>
  </template>
</template>

<style lang="scss" scoped>
img {
  display: var(--fa-display, inline-block);
  height: 1em;
  vertical-align: -0.125em;
}
</style>
