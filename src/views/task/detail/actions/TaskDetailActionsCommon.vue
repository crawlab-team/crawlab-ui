<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
import { TASK_STATUS_PENDING, TASK_STATUS_RUNNING } from '@/constants';
import useRequest from '@/services/request';
import { translate, isCancellable } from '@/utils';
import useTask from '@/components/core/task/useTask';
import useTaskDetail from '@/views/task/detail/useTaskDetail';

const { post } = useRequest();

// i18n
const t = translate;

// router
const router = useRouter();

// store
const ns = 'task';
const store = useStore();

// use task
const { form } = useTask(store);

// use task detail
const { activeId } = useTaskDetail();

// restart
const onRestart = async () => {
  await ElMessageBox.confirm(
    t('common.messageBox.confirm.restart'),
    'Restart',
    { type: 'warning' }
  );
  await post(`/tasks/${activeId.value}/restart`);
  ElMessage.success('common.message.success.restart');
  await store.dispatch(`${ns}/getById`, activeId.value);
};

// cancel
const onCancel = async () => {
  await ElMessageBox.confirm(
    t('common.messageBox.confirm.cancel'),
    t('common.actions.cancel'),
    { type: 'warning' }
  );
  ElMessage.info('Attempt to cancel');
  await post(`/tasks/${activeId.value}/cancel`);
  await store.dispatch(`${ns}/getById`, activeId.value);
};

// delete
const onDelete = async () => {
  await ElMessageBox.confirm(
    t('common.messageBox.confirm.delete'),
    t('common.actions.delete'),
    {
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
    }
  );
  await store.dispatch(`${ns}/deleteById`, activeId.value);
  await router.push('/tasks');
};

// cancellable
const cancellable = computed<boolean>(() => isCancellable(form.value?.status));

// total duration
const getTotalDuration = () => {
  switch (form.value?.status) {
    case TASK_STATUS_PENDING:
    case TASK_STATUS_RUNNING:
      return dayjs().diff(form.value?.stat?.create_ts, 'ms');
    default:
      return form.value?.stat?.total_duration;
  }
};
const totalDuration = computed<number>(() => getTotalDuration());
defineOptions({ name: 'ClTaskDetailActionsCommon' });
</script>

<template>
  <cl-nav-action-group class="task-detail-actions-common">
    <cl-nav-action-fa-icon :icon="['fa', 'tools']" />
    <cl-nav-action-item>
      <cl-task-status :status="form.status" size="large" />
    </cl-nav-action-item>
    <cl-nav-action-item>
      <cl-fa-icon-button
        :icon="['fa', 'redo']"
        :tooltip="t('common.actions.restart')"
        type="warning"
        @click="onRestart"
      />
    </cl-nav-action-item>
    <cl-nav-action-item>
      <cl-fa-icon-button
        v-if="cancellable"
        :icon="['fa', 'pause']"
        :tooltip="t('common.actions.cancel')"
        type="info"
        @click="onCancel"
      />
      <cl-fa-icon-button
        v-else
        :icon="['fa', 'trash-alt']"
        :tooltip="t('common.actions.delete')"
        type="danger"
        @click="onDelete"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
  <cl-nav-action-group class="task-detail-actions-common">
    <cl-nav-action-fa-icon :icon="['fa', 'line-chart']" />
    <cl-nav-action-item>
      <cl-task-results
        :results="form?.stat?.result_count"
        :status="form?.status"
        size="large"
      />
      <cl-duration
        :duration="totalDuration"
        is-tag
        size="large"
        :tooltip="t('views.tasks.table.columns.stat.total_duration')"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped>
.task-detail-actions-common:deep(.task-results),
.task-detail-actions-common:deep(.task-status),
.task-detail-actions-common:deep(.duration) {
  margin-right: 10px;
}
</style>
