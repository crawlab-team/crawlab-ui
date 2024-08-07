<script setup lang="ts">
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import useSpider from '@/components/core/spider/useSpider';
import useNode from '@/components/core/node/useNode';
import { TASK_MODE_SELECTED_NODES } from '@/constants/task';
import useRequest from '@/services/request';
import useTask from '@/components/core/task/useTask';
import { isCancellable } from '@/utils/task';
import { ElMessage, ElMessageBox } from 'element-plus';
import { isZeroObjectId } from '@/utils/mongo';
import useTaskDetail from '@/views/task/detail/useTaskDetail';
import { translate } from '@/utils';

defineProps<{
  readonly?: boolean;
}>();

const { post } = useRequest();

// i18n
const t = translate;

// store
const ns = 'task';
const store = useStore();

// use node
const { allListSelectOptions: allNodeSelectOptions, allDict: allNodeDict } =
  useNode(store);

// use spider
const { allListSelectOptions: allSpiderSelectOptions } = useSpider(store);

// use task
const {
  form,
  formRef,
  allSpiderDict,
  modeOptions,
  modeOptionsDict,
  priorityOptions,
  isFormItemDisabled,
} = useTask(store);

// use task detail
const { activeId } = useTaskDetail();

// use request
const { get } = useRequest();

// watch spider id
watch(
  () => {
    const task = form.value as Task;
    return task.spider_id;
  },
  async () => {
    const task = form.value as Task;
    if (!task.spider_id) return;
    const res = await get<any, Spider>(`/spiders/${task.spider_id}`);
    task.cmd = res.data.cmd;
    task.param = res.data.param;
  }
);

const getSpiderName = (id: string) => {
  const spider = allSpiderDict.value.get(id) as Spider;
  return spider?.name;
};

const getNodeName = (id: string) => {
  const node = allNodeDict.value.get(id) as CNode;
  return node?.name;
};

const getModeName = (id: string) => {
  const op = modeOptionsDict.value.get(id) as SelectOption;
  return op?.label;
};

const cancellable = computed<boolean>(() => isCancellable(form.value.status));

const onCancel = async () => {
  await ElMessageBox.confirm(
    t('common.messageBox.confirm.cancel'),
    t('common.actions.cancel'),
    { type: 'warning' }
  );
  ElMessage.info('common.message.info.cancel');
  try {
    await post(`/tasks/${activeId.value}/cancel`);
  } finally {
    await store.dispatch(`${ns}/getById`, activeId.value);
  }
};

const noNodeId = computed<boolean>(() => isZeroObjectId(form.value.node_id));
defineOptions({ name: 'ClTaskForm' });
</script>

<template>
  <cl-form v-if="form" ref="formRef" :model="form" class="task-form">
    <!-- Row -->
    <cl-form-item
      :offset="2"
      :span="2"
      :label="t('components.task.form.spider')"
      prop="spider_id"
      :required="!readonly"
    >
      <el-select
        v-if="!isFormItemDisabled('spider_id') && !readonly"
        v-locate="'spider_id'"
        v-model="form.spider_id"
        filterable
      >
        <el-option
          v-for="op in allSpiderSelectOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
      <cl-nav-link
        v-else
        :label="form.spider?.name || getSpiderName(form.spider_id)"
        :path="`/spiders/${form.spider_id}`"
      />
    </cl-form-item>
    <!-- ./Row -->

    <!-- Row -->
    <cl-form-item
      v-if="readonly"
      :offset="2"
      :span="2"
      :label="t('components.task.form.node')"
      prop="node_id"
    >
      <el-input
        v-if="noNodeId"
        disabled
        :placeholder="t('common.status.unassigned')"
      />
      <cl-nav-link
        v-else
        :label="getNodeName(form.node_id)"
        :path="`/nodes/${form.node_id}`"
      />
    </cl-form-item>
    <!-- ./Row -->

    <!-- Row -->
    <cl-form-item
      v-if="readonly"
      :span="4"
      :label="t('components.task.form.status')"
      prop="status"
    >
      <cl-task-status :status="form.status" :error="form.error" />
      <cl-tag
        v-if="form.status === 'error'"
        :icon="['fa', 'exclamation']"
        :label="form.error"
        class-name="error-message"
        :tooltip="t('components.task.form.tooltip.taskErrorMessage')"
        type="danger"
      />
      <cl-tag
        v-else-if="cancellable"
        :icon="['fa', 'pause']"
        class-name="cancel-btn"
        clickable
        :label="t('common.actions.cancel')"
        :tooltip="t('components.task.form.tooltip.cancelTask')"
        type="info"
        @click="onCancel"
      />
    </cl-form-item>
    <!-- ./Row -->

    <!-- Row -->
    <cl-form-item
      :span="2"
      :label="t('components.task.form.command')"
      prop="cmd"
      :required="!readonly"
    >
      <el-input
        v-if="!isFormItemDisabled('cmd') && !readonly"
        v-locate="'cmd'"
        v-model="form.cmd"
        :placeholder="t('components.task.form.command')"
      />
      <cl-tag v-else size="large" :label="form.cmd || '-'" />
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('components.task.form.param')"
      prop="param"
    >
      <el-input
        v-if="!isFormItemDisabled('param') && !readonly"
        v-locate="'param'"
        v-model="form.param"
        :placeholder="t('components.task.form.param')"
      />
      <cl-tag v-else size="large" :label="form.param || '-'" />
    </cl-form-item>
    <!-- ./Row -->

    <!-- Row -->
    <cl-form-item
      :span="2"
      :label="t('components.task.form.mode')"
      prop="mode"
      :required="!readonly"
    >
      <el-select
        v-if="!isFormItemDisabled('mode') && !readonly"
        v-locate="'mode'"
        v-model="form.mode"
      >
        <el-option
          v-for="op in modeOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
      <cl-tag v-else size="large" :label="getModeName(form.mode) || '-'" />
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('components.task.form.priority')"
      prop="priority"
      :required="!readonly"
    >
      <el-select
        v-if="!isFormItemDisabled('priority') && !readonly"
        v-locate="'priority'"
        v-model="form.priority"
      >
        <el-option
          v-for="op in priorityOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
      <cl-task-priority v-else :priority="form.priority" size="large" />
    </cl-form-item>
    <!-- ./Row -->

    <cl-form-item
      v-if="TASK_MODE_SELECTED_NODES === form.mode"
      :span="4"
      :label="t('components.task.form.selectedNodes')"
      required
    >
      <cl-check-tag-group
        v-locate="'node_ids'"
        v-model="form.node_ids"
        :disabled="isFormItemDisabled('node_ids') || readonly"
        :options="allNodeSelectOptions"
      />
    </cl-form-item>
  </cl-form>
</template>

<style scoped>
.task-form:deep(.nav-btn) {
  position: absolute;
  padding-left: 10px;
}

.task-form:deep(.error-message),
.task-form:deep(.cancel-btn) {
  margin-left: 10px;
}

.task-form:deep(.cancel-btn:hover) {
  opacity: 0.8;
}
</style>
