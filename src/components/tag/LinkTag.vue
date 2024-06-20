<script setup lang="ts">
defineOptions({ name: 'ClLinkTag' });
import { useRouter } from 'vue-router';

export interface LinkTagProps extends TagProps {
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
