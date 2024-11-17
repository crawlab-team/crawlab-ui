<script setup lang="ts">
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useNode, useTask } from '@/components';
import { isZeroObjectId, translate } from '@/utils';

const t = translate;

const router = useRouter();

const store = useStore();

const { form } = useTask(store);

const { allDict: allNodeDict } = useNode(store);

defineOptions({ name: 'ClTaskDetailActionGroupNav' });
</script>

<template>
  <cl-nav-action-group class="task-detail-actions-common">
    <cl-nav-action-fa-icon :icon="['fa', 'compass']" />
    <cl-nav-action-item v-if="!isZeroObjectId(form?.node_id)">
      <cl-node-tag
        :node="allNodeDict.get(form.node_id!)"
        size="large"
        no-label
        clickable
        @click="router.push(`/nodes/${form.node_id}`)"
      />
    </cl-nav-action-item>
    <cl-nav-action-item v-if="!isZeroObjectId(form?.spider_id)">
      <cl-tag
        type="primary"
        size="large"
        :icon="['fa', 'spider']"
        :tooltip="`${t('components.task.form.spider')}: ${form?.spider?.name || form?.spider_id}`"
        clickable
        @click="router.push(`/spiders/${form.spider_id}`)"
      />
    </cl-nav-action-item>
    <cl-nav-action-item v-if="!isZeroObjectId(form?.schedule_id)">
      <cl-tag
        type="primary"
        size="large"
        :icon="['fa', 'clock']"
        :tooltip="`${t('components.task.form.schedule')}: ${form?.schedule?.name || form?.schedule_id}`"
        clickable
        @click="router.push(`/spiders/${form.spider_id}`)"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>
