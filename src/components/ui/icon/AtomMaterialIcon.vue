<script setup lang="ts">
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
defineOptions({ name: 'ClAtomMaterialIcon' });
</script>

<template>
  <span class="atom-material-icon" v-html="html" />
</template>


