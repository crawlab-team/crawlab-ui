<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { isPro } from '@/utils';
import { useSpiderDetail } from '@/views';

// store
const store = useStore();
const { spider: state } = store.state;

const displayAllFields = computed<boolean>(() => state.dataDisplayAllFields);

const { activeId } = useSpiderDetail();

defineOptions({ name: 'ClSpiderDetailTabData' });
</script>

<template>
  <div class="spider-detail-tab-data">
    <template v-if="isPro()">
      <cl-spider-result-data-with-database
        :display-all-fields="displayAllFields"
      />
    </template>
    <template v-else>
      <cl-result-list
        :spider-id="activeId"
        :display-all-fields="displayAllFields"
        no-actions
        embedded
      />
    </template>
  </div>
</template>
