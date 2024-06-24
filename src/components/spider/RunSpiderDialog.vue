<script setup lang="ts">
defineOptions({ name: 'ClRunSpiderDialog' });
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'vuex';
import useSpider from '@/components/spider/useSpider';
import useNode from '@/components/node/useNode';
import { TASK_MODE_RANDOM, TASK_MODE_SELECTED_NODES } from '@/constants/task';
import useTask from '@/components/task/useTask';
import { ElMessage } from 'element-plus';
import { sendEvent } from '@/admin/umeng';
import { translate } from '@/utils';

// i18n
const t = translate;

// store
const ns = 'spider';
const store = useStore();
const { spider: state } = store.state as RootStoreState;

const { allListSelectOptions: allNodeSelectOptions } = useNode(store);

const { modeOptions, form } = useSpider(store);

const { priorityOptions } = useTask(store);

// spider
const spider = computed<Spider>(() => form.value);

// form ref
const formRef = ref();

// get run options
const getOptions = (): SpiderRunOptions => {
  return {
    mode: spider.value.mode || TASK_MODE_RANDOM,
    cmd: spider.value.cmd,
    param: spider.value.param,
    priority: spider.value.priority || 5,
  };
};

// run options
const options = ref<SpiderRunOptions>(getOptions());

// dialog visible
const visible = computed<boolean>(() => state.activeDialogKey === 'run');

// title
const title = computed<string>(() => {
  if (!spider.value) return t('components.spider.dialog.run.title');
  return `${t('components.spider.dialog.run.title')} - ${spider.value.name}`;
});

const onClose = () => {
  store.commit(`${ns}/hideDialog`);

  sendEvent('click_run_spider_dialog_close');
};

const onConfirm = async () => {
  await formRef.value?.validate();
  await store.dispatch(`${ns}/runById`, {
    id: spider.value?._id,
    options: options.value,
  });
  store.commit(`${ns}/hideDialog`);
  ElMessage.success(t('components.spider.message.success.scheduleTask'));
  await store.dispatch(`${ns}/getList`);

  sendEvent('click_run_spider_dialog_confirm', {
    mode: options.value?.mode,
    priority: options.value?.priority,
  });
};

const updateOptions = () => {
  options.value = getOptions();
};

watch(() => spider.value, updateOptions);
onBeforeMount(updateOptions);
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

<style lang="scss" scoped></style>
