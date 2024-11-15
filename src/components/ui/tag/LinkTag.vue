<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { LinkTagProps } from './types';

const props = defineProps<LinkTagProps>();

const router = useRouter();

const onClick = () => {
  const { path } = props;
  if (path) {
    router.push(path);
  }
};
defineOptions({ name: 'ClLinkTag' });
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
