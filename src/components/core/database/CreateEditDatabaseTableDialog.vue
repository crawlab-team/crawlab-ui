<script setup lang="ts">
const props = defineProps<{
  visible?: boolean;
}>();

defineOptions({ name: 'ClCreateEditDatabaseTableDialog' });
</script>

<template>
  <cl-dialog :visible="visible"></cl-dialog>
</template>

<style scoped></style>
