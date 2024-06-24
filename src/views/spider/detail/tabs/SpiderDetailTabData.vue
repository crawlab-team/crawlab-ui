<script setup lang="ts">
defineOptions({ name: 'ClSpiderDetailTabData' });
import { computed } from 'vue';
import { useStore } from 'vuex';
import useSpider from '@/components/spider/useSpider';

// store
const store = useStore();
const { spider: state } = store.state;

const displayAllFields = computed<boolean>(() => state.dataDisplayAllFields);

const { form } = useSpider(store);
</script>

<template>
  <div class="spider-detail-tab-data">
    <cl-result-list
      :id="form?.col_id"
      :data-source-id="form?.data_source_id"
      :display-all-fields="displayAllFields"
      no-actions
      embedded
    />
  </div>
</template>

<style scoped>
.spider-detail-tab-data:deep(.el-table) {
  border: none;
}
</style>
