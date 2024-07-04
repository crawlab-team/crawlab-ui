<script setup lang="ts">
import { onBeforeMount, watch } from 'vue';
import { useStore } from 'vuex';
import { isPro } from '@/utils';
import { TAB_NAME_MONITORING } from '@/constants';

const ns = 'node';
const store = useStore();
const { common: commonState } = store.state as RootStoreState;
onBeforeMount(() => {
  if (!isPro()) {
    store.commit(`${ns}/setDisabledTabKeys`, [TAB_NAME_MONITORING]);
  }
});

defineOptions({ name: 'ClNodeDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="node">
    <template #actions>
      <cl-node-detail-actions-common />
    </template>
  </cl-detail-layout>
</template>

<style lang="scss" scoped></style>
