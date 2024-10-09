<script setup lang="ts">
import { defineComponent, onBeforeMount, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import useSpiderDetail from '@/views/spider/detail/useSpiderDetail';
import { isPro } from '@/utils';

const ns = 'spider';
const store = useStore();

const { activeTabName, saveFile } = useSpiderDetail();

onBeforeMount(async () => {
  await Promise.all([store.dispatch(`project/getAllList`)]);

  store.commit(`${ns}/setAfterSave`, [saveFile]);
});
defineOptions({ name: 'ClSpiderDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="spider">
    <template #actions>
      <cl-spider-detail-actions-common />
      <cl-spider-detail-actions-files v-if="activeTabName === 'files'" />
      <template v-if="isPro()">
        <cl-spider-detail-actions-data v-if="activeTabName === 'data'" />
      </template>
      <slot name="actions-suffix" />
    </template>
  </cl-detail-layout>

  <!-- Dialogs (handled by store) -->
  <cl-upload-spider-files-dialog />
  <cl-result-dedup-fields-dialog />
  <!-- ./Dialogs -->
</template>

<style scoped lang="scss"></style>
