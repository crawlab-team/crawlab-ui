<script setup lang="ts">
defineOptions({ name: 'ClLinkTag' });
import { useRouter } from 'vue-router';

interface TagProps {
  label?: string;
  tooltip?: string;
  type?: BasicType;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  icon?: Icon;
  suffixIcon?: Icon;
  size?: BasicSize;
  spinning?: boolean;
  width?: string;
  effect?: BasicEffect;
  clickable?: boolean;
  closable?: boolean;
  disabled?: boolean;
  className?: string;
}

interface LinkTagProps extends TagProps {
  path?: string;
}

const props = defineProps<LinkTagProps>();

const router = useRouter();

const onClick = () => {
  const { path } = props;
  if (path) {
    router.push(path);
  }
};
</script>

<template>
  <cl-tag
    :clickable="clickable"
    :color="color"
    :effect="effect"
    :icon="icon"
    :suffix-icon="suffixIcon"
    :label="label"
    :spinning="spinning"
    :tooltip="tooltip"
    :type="type"
    :width="width"
    class="link-tag"
    @click="onClick"
  />
</template>

<style lang="scss" scoped></style>
