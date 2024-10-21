<script setup lang="ts">
import { onBeforeMount, watch } from 'vue';
import { useStore } from 'vuex';
import { isPro } from '@/utils';
import { TAB_NAME_MONITORING } from '@/constants';

const ns = 'node';
const store = useStore();
const { common: commonState } = store.state as RootStoreState;
const updateDisabledTabKeys = () => {
  if (!isPro()) {
    store.commit(`${ns}/setDisabledTabKeys`, [TAB_NAME_MONITORING]);
  } else {
    store.commit(`${ns}/setDisabledTabKeys`, []);
  }
};
onBeforeMount(updateDisabledTabKeys);
watch(() => commonState.systemInfo, updateDisabledTabKeys);

defineOptions({ name: 'ClNodeDetail' });
</script>

<template>
  <cl-detail-layout store-namespace="node">
    <template #actions>
      <cl-node-detail-actions-common />
    </template>
  </cl-detail-layout>
</template>
