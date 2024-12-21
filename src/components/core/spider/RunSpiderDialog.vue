<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import useSpider from '@/components/core/spider/useSpider';
import useNode from '@/components/core/node/useNode';
import { TASK_MODE_RANDOM, TASK_MODE_SELECTED_NODES } from '@/constants/task';
import { ElMessage } from 'element-plus';
import { priorityOptions, translate } from '@/utils';

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

const { allListSelectOptions: allNodeSelectOptions } = useNode(store);

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
  store.commit(`${ns}/resetForm`);
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

      <!-- Row -->
      <cl-form-item
        :span="2"
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
        :span="2"
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
      <!-- ./Row -->

      <cl-form-item
        v-if="TASK_MODE_SELECTED_NODES === options.mode"
        :span="4"
        :label="t('components.task.form.selectedNodes')"
        required
      >
        <cl-check-tag-group
          v-model="options.node_ids"
          :options="allNodeSelectOptions"
        />
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>
