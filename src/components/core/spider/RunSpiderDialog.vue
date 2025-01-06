<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import useSpider from '@/components/core/spider/useSpider';
import useNode from '@/components/core/node/useNode';
import { TASK_MODE_RANDOM, TASK_MODE_SELECTED_NODES } from '@/constants/task';
import { ElMessage } from 'element-plus';
import { getToRunNodes, priorityOptions, translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    ns?: ListStoreNamespace;
  }>(),
  {
    ns: 'spider',
  }
);

// i18n
const t = translate;

// store
const store = useStore();

const { activeNodesSorted: activeNodes } = useNode(store);

const toRunNodes = computed(() => {
  const { mode, node_ids } = options.value;
  return getToRunNodes(mode, node_ids, activeNodes.value);
});

const { modeOptions } = useSpider(store);

// form
const form = computed(() => {
  const { ns } = props;
  return store.state[ns].form;
});

// form ref
const formRef = ref();

// get run options
const getOptions = (): SpiderRunOptions => {
  return {
    mode: form.value.mode || TASK_MODE_RANDOM,
    cmd: form.value.cmd,
    param: form.value.param,
    priority: form.value.priority || 5,
    node_ids: form.value.node_ids || [],
  };
};

// run options
const options = ref<SpiderRunOptions>(getOptions());

// dialog visible
const visible = computed<boolean>(() => {
  const { ns } = props;
  return store.state[ns].activeDialogKey === 'run';
});

// title
const title = computed<string>(() => {
  const { ns } = props;
  if (!form.value) return t(`components.${ns}.dialog.run.title`);
  return `${t(`components.${ns}.dialog.run.title`)} - ${form.value.name}`;
});

const onClose = () => {
  const { ns } = props;
  store.commit(`${ns}/hideDialog`);
};

const onConfirm = async () => {
  const { ns } = props;
  await formRef.value?.validate();
  await store.dispatch(`${ns}/runById`, {
    id: form.value?._id,
    options: options.value,
  });
  store.commit(`${ns}/hideDialog`);
  ElMessage.success(t('components.spider.message.success.scheduleTask'));
  await store.dispatch(`${ns}/getList`);
};

const updateOptions = () => {
  options.value = getOptions();
};

watch(() => form.value, updateOptions);
onBeforeMount(updateOptions);
defineOptions({ name: 'ClRunSpiderDialog' });
</script>

<template>
  <cl-dialog
    :title="title"
    :visible="visible"
    class-name="run-spider-dialog"
    width="1024px"
    @close="onClose"
    @confirm="onConfirm"
  >
    <cl-form ref="formRef" :model="options">
      <!-- Row -->
      <cl-form-item
        :span="2"
        :label="t('components.task.form.command')"
        prop="cmd"
        required
      >
        <el-input
          v-model="options.cmd"
          :placeholder="t('components.task.form.command')"
        />
      </cl-form-item>
      <cl-form-item
        :span="2"
        :label="t('components.task.form.param')"
        prop="param"
      >
        <el-input
          v-model="options.param"
          :placeholder="t('components.task.form.param')"
        />
      </cl-form-item>
      <!-- ./Row -->

      <cl-form-item
        :span="2"
        :offset="options.mode === TASK_MODE_SELECTED_NODES ? 0 : 2"
        :label="t('components.task.form.mode')"
        prop="mode"
        required
      >
        <el-select v-model="options.mode">
          <el-option
            v-for="op in modeOptions"
            :key="op.value"
            :label="op.label"
            :value="op.value"
          />
        </el-select>
      </cl-form-item>
      <cl-form-item
        v-if="options.mode === TASK_MODE_SELECTED_NODES"
        :span="2"
        :label="t('components.task.form.selectedNodes')"
        prop="node_ids"
        required
      >
        <el-select
          v-model="options.node_ids"
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
        v-if="options.mode !== TASK_MODE_RANDOM"
        :label="t('components.task.form.toRunNodes')"
        :span="4"
      >
        <cl-node-tag v-for="n in toRunNodes" :key="n.key" :node="n" />
      </cl-form-item>

      <cl-form-item
        :span="2"
        :offset="2"
        :label="t('components.task.form.priority')"
        prop="priority"
        required
      >
        <el-select v-model="options.priority">
          <el-option
            v-for="op in priorityOptions"
            :key="op.value"
            :label="op.label"
            :value="op.value"
          />
        </el-select>
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>
