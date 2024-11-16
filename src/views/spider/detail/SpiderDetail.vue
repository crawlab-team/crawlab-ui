<script setup lang="ts">
import { onBeforeMount, watch } from 'vue';
import { useStore } from 'vuex';
import useSpiderDetail from '@/views/spider/detail/useSpiderDetail';
import { isPro } from '@/utils';
import { TAB_NAME_DEPENDENCIES } from '@/constants';

const ns = 'spider';
const store = useStore();
const { common: commonState } = store.state as RootStoreState;

const { activeTabName } = useSpiderDetail();

const updateDisabledTabKeys = () => {
  if (!isPro()) {
    store.commit(`${ns}/setDisabledTabKeys`, [TAB_NAME_DEPENDENCIES]);
  } else {
    store.commit(`${ns}/setDisabledTabKeys`, []);
  }
};
onBeforeMount(updateDisabledTabKeys);
watch(() => commonState.systemInfo, updateDisabledTabKeys);

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
