<script setup lang="ts">
defineOptions({ name: 'ClSpiderDetail' });
import { defineComponent, onBeforeMount, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import useSpiderDetail from '@/views/spider/detail/useSpiderDetail';

const ns = 'spider';
const store = useStore();

const { activeTabName, saveFile } = useSpiderDetail();

onBeforeMount(async () => {
  await Promise.all([store.dispatch(`project/getAllList`)]);

  store.commit(`${ns}/setAfterSave`, [saveFile]);
});
</script>

<template>
  <cl-detail-layout store-namespace="spider">
    <template #actions>
      <cl-spider-detail-actions-common />
      <cl-spider-detail-actions-files v-if="activeTabName === 'files'" />
      <cl-spider-detail-actions-data v-if="activeTabName === 'data'" />
      <cl-spider-detail-actions-data-source v-if="activeTabName === 'data'" />
      <slot name="actions-suffix" />
    </template>
  </cl-detail-layout>

  <!-- Dialogs (handled by store) -->
  <cl-upload-spider-files-dialog />
  <cl-result-dedup-fields-dialog />
  <!-- ./Dialogs -->
</template>

<style scoped lang="scss"></style>
