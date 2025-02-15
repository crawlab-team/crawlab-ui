<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import useRequest from '@/services/request';
import { getToRunNodes, isCancellable, priorityOptions } from '@/utils/task';
import { isZeroObjectId } from '@/utils/mongo';
import { translate } from '@/utils';
import { useTaskDetail } from '@/views';
import { useSpider, useNode, useTask } from '@/components';
import { TASK_MODE_RANDOM, TASK_MODE_SELECTED_NODES } from '@/constants';

defineProps<{
  readonly?: boolean;
}>();

const { post } = useRequest();

const router = useRouter();

// i18n
const t = translate;

// store
const store = useStore();

// use node
const { activeNodesSorted: activeNodes, allDict: allNodeDict } = useNode(store);

const toRunNodes = computed(() => {
  const { mode, node_ids } = form.value;
  return getToRunNodes(mode, node_ids, activeNodes.value);
});

const runNode = computed(() => {
  const { node_id } = form.value;
  return activeNodes.value.find(n => n._id === node_id);
});

// use spider
const { allListSelectOptions: allSpiderSelectOptions } = useSpider(store);

// use task
const {
  form,
  formRef,
  allSpiderDict,
  modeOptions,
  modeOptionsDict,
  isFormItemDisabled,
} = useTask(store);

// use task detail
const { activeId, getForm } = useTaskDetail();

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
    await getForm();
  }
};

const noScheduleId = computed<boolean>(() =>
  isZeroObjectId(form.value?.schedule_id)
);

const validate = async () => {
  await formRef.value?.validate();
};

defineExpose({
  validate,
});

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
        :label="form.spider?.name || getSpiderName(form.spider_id!)"
        :path="`/spiders/${form.spider_id}`"
      />
    </cl-form-item>
    <!-- ./Row -->

    <!-- Row -->
    <cl-form-item
      v-if="readonly && !isZeroObjectId(form.node_id)"
      :offset="2"
      :span="2"
      :label="t('components.task.form.node')"
      prop="node_id"
    >
      <cl-node-tag
        :node="allNodeDict.get(form.node_id!)"
        size="large"
        clickable
        @click="router.push(`/nodes/${form.node_id}`)"
      />
    </cl-form-item>
    <!-- ./Row -->

    <!-- Row -->
    <cl-form-item
      v-if="!noScheduleId && readonly"
      :offset="2"
      :span="2"
      :label="t('components.task.form.schedule')"
      prop="schedule_id"
    >
      <cl-nav-link
        :label="form.schedule?.name"
        :path="`/schedules/${form.schedule_id}`"
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
      <cl-task-status :status="form.status" :error="form.error" size="large" />
      <cl-tag
        v-if="form.status === 'error'"
        :icon="['fa', 'exclamation']"
        size="large"
        :label="form.error"
        class-name="error-message"
        :tooltip="t('components.task.form.tooltip.taskErrorMessage')"
        type="danger"
      />
      <cl-tag
        v-else-if="cancellable"
        :icon="['fa', 'pause']"
        size="large"
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
        v-model="form.param"
        :placeholder="t('components.task.form.param')"
      />
      <cl-tag v-else size="large" :label="form.param || '-'" />
    </cl-form-item>
    <!-- ./Row -->

    <cl-form-item
      :span="2"
      :offset="form.mode === TASK_MODE_SELECTED_NODES && !readonly ? 0 : 2"
      :label="t('components.task.form.mode')"
      prop="mode"
      :required="!readonly"
    >
      <el-select
        v-if="!isFormItemDisabled('mode') && !readonly"
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
      v-if="form.mode === TASK_MODE_SELECTED_NODES && !readonly"
      :span="2"
      :label="t('components.task.form.selectedNodes')"
      prop="node_ids"
      required
    >
      <el-select
        v-model="form.node_ids"
        multiple
        :placeholder="t('components.task.form.selectedNodes')"
      >
        <el-option
          v-for="n in activeNodes"
          :key="n.key"
          :value="n._id"
          :label="n.name"
        >
          <span style="margin-right: 5px">
            <cl-node-tag :node="n" icon-only />
          </span>
          <span>{{ n.name }}</span>
        </el-option>
      </el-select>
    </cl-form-item>
    <cl-form-item
      v-if="form.mode !== TASK_MODE_RANDOM"
      :label="
        !readonly
          ? t('components.task.form.toRunNodes')
          : t('components.task.form.node')
      "
      :span="4"
    >
      <template v-if="!readonly">
        <template v-if="toRunNodes.length > 0">
          <cl-node-tag v-for="n in toRunNodes" :key="n.key" :node="n" />
        </template>
        <template v-else>
          <cl-tag type="info" :label="t('common.placeholder.empty')" />
        </template>
      </template>
      <template v-else>
        <cl-node-tag v-if="runNode" :node="runNode" />
      </template>
    </cl-form-item>

    <cl-form-item
      :span="2"
      :offset="2"
      :label="t('components.task.form.priority')"
      prop="priority"
      :required="!readonly"
    >
      <el-select
        v-if="!isFormItemDisabled('priority') && !readonly"
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
  </cl-form>
</template>

<style scoped>
.task-form:deep(.nav-btn) {
  position: absolute;
  padding-left: 10px;
}

.task-form:deep(.cancel-btn:hover) {
  opacity: 0.8;
}
</style>
