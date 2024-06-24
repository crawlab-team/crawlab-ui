<script setup lang="ts">
defineOptions({ name: 'ClAtomMaterialIcon' });
import { computed } from 'vue';
import {
  getFileIconFromName,
  getFolderIconFromName,
} from 'atom-material-icons';

const props = defineProps<{
  name: string;
  isDir?: boolean;
}>();

const html = computed<string>(() => {
  const { name, isDir } = props;
  const icon = isDir ? getFolderIconFromName(name) : getFileIconFromName(name);
  return icon.default;
});
</script>

<template>
  <span class="atom-material-icon" v-html="html" />
</template>

<style lang="scss" scoped></style>
