<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import useSpider from '@/components/core/spider/useSpider';
import { isPro } from '@/utils';

// store
const store = useStore();
const { spider: state } = store.state;

const displayAllFields = computed<boolean>(() => state.dataDisplayAllFields);

const { form } = useSpider(store);

defineOptions({ name: 'ClSpiderDetailTabData' });
</script>

<template>
  <div class="spider-detail-tab-data">
    <template v-if="isPro()">
      <cl-spider-result-data-with-database />
    </template>
    <template v-else>
      <cl-result-list
        :id="form?.col_id"
        :display-all-fields="displayAllFields"
        no-actions
        embedded
      />
    </template>
  </div>
</template>
