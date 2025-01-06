<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useSpider, useProject, useNode } from '@/components';
import { TASK_MODE_RANDOM, TASK_MODE_SELECTED_NODES } from '@/constants/task';
import pinyin, { STYLE_NORMAL } from 'pinyin';
import { isZeroObjectId } from '@/utils/mongo';
import { useSpiderDetail } from '@/views';
import { getToRunNodes, priorityOptions, translate } from '@/utils';
import { getSpiderTemplateGroups, getSpiderTemplates } from '@/utils/spider';

// i18n
const t = translate;

// store
const store = useStore();

// use node
const { activeNodesSorted: activeNodes } = useNode(store);

const toRunNodes = computed(() => {
  const { mode, node_ids } = form.value;
  return getToRunNodes(mode, node_ids, activeNodes.value);
});

// use project
const { allListSelectOptionsWithEmpty: allProjectSelectOptions } =
  useProject(store);

// use spider
const { form, formRef, isFormItemDisabled, modeOptions } = useSpider(store);

// use spider detail
const { activeId } = useSpiderDetail();

const isDetail = computed(() => !!activeId.value);

// whether col field of form has been changed
const isFormColChanged = ref<boolean>(false);

watch(
  () => form.value?.name,
  () => {
    if (isFormColChanged.value) return;
    if (form.value?._id && isZeroObjectId(form.value?._id)) return;
    if (activeId.value && form.value?.col_name) return;
    if (!form.value.name) {
      form.value.col_name = '';
    } else {
      const name = pinyin(form.value.name, { style: STYLE_NORMAL })
        .map(d => d.join('_'))
        .join('_');
      form.value.col_name = `results_${name}`;
    }
  }
);

const onDataCollectionSuggestionSelect = ({
  _id,
}: {
  _id: string;
  value: string;
}) => {
  form.value.col_id = _id;
};

const onDataCollectionInput = (value: string) => {
  form.value.col_name = value;
  form.value.col_id = undefined;
};

const validate = async () => {
  await formRef.value?.validate();
};

const spiderTemplateGroupOptions = computed<SelectOption[]>(() => {
  return getSpiderTemplateGroups().map(group => ({
    label: group.label,
    icon: group.icon || ['fa', 'box'],
    children: group.templates.map(({ name, label, icon }) => ({
      label,
      value: name,
      icon: icon || ['fa', 'box'],
    })),
  }));
});
const onTemplateChange = (value: string) => {
  const template = getSpiderTemplates().find(d => d.name === value);
  if (!template) return;
  form.value.name = `${template.name}_spider`;
  form.value.cmd = template.cmd;
};
const activeTemplateOption = computed<SpiderTemplate | undefined>(() => {
  return getSpiderTemplates().find(d => d.name === form.value.template);
});

defineExpose({
  validate,
});
defineOptions({ name: 'ClSpiderForm' });
</script>

<template>
  <cl-form v-if="form" ref="formRef" :model="form">
    <slot name="header" />

    <template v-if="!isDetail">
      <cl-form-item
        :span="2"
        :offset="activeTemplateOption?.doc_url ? 0 : 2"
        :label="t('components.spider.form.template')"
        prop="template"
      >
        <el-select
          v-model="form.template"
          filterable
          clearable
          @change="onTemplateChange"
        >
          <el-option-group
            v-for="g in spiderTemplateGroupOptions"
            :key="g.value"
            :label="g.label"
          >
            <el-option
              v-for="op in g.children"
              :key="op.value"
              :value="op.value"
            >
              <span class="icon-wrapper">
                <cl-icon :icon="op.icon" />
              </span>
              {{ op.label }}
            </el-option>
          </el-option-group>
          <template #label>
            <span class="icon-wrapper">
              <cl-icon :icon="activeTemplateOption?.icon" />
            </span>
            {{ activeTemplateOption?.label }}
          </template>
        </el-select>
      </cl-form-item>
      <cl-form-item
        v-if="activeTemplateOption?.doc_url && activeTemplateOption?.doc_label"
        :span="2"
        :label="t('components.spider.form.templateDoc')"
      >
        <cl-nav-link :path="activeTemplateOption?.doc_url" external>
          {{ activeTemplateOption?.doc_label }}
        </cl-nav-link>
      </cl-form-item>
    </template>

    <!-- Row -->
    <cl-form-item
      :span="2"
      :label="t('components.spider.form.name')"
      prop="name"
      required
    >
      <el-input
        v-model="form.name"
        :disabled="isFormItemDisabled('name')"
        :placeholder="t('components.spider.form.name')"
        id="name"
        class="name"
      />
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('components.spider.form.project')"
      prop="project_id"
    >
      <el-select
        v-model="form.project_id"
        :disabled="isFormItemDisabled('project_id')"
        filterable
        id="project"
        class="project"
        popper-class="spider-form-project"
      >
        <cl-option
          v-for="op in allProjectSelectOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </cl-form-item>
    <!-- ./Row -->

    <!-- Row -->
    <cl-form-item
      :span="2"
      :label="t('components.spider.form.command')"
      prop="cmd"
      required
    >
      <el-input
        v-model="form.cmd"
        :placeholder="t('components.spider.form.command')"
        :disabled="isFormItemDisabled('cmd')"
        id="cmd"
        class-name="cmd"
      />
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('components.spider.form.param')"
      prop="param"
    >
      <el-input
        v-model="form.param"
        :placeholder="t('components.spider.form.param')"
        :disabled="isFormItemDisabled('param')"
        id="cmd"
        class-name="param"
      />
    </cl-form-item>
    <!-- ./Row -->

    <!-- Row -->
    <cl-form-item
      :span="2"
      :offset="form.mode === TASK_MODE_SELECTED_NODES ? 0 : 2"
      :label="t('components.spider.form.defaultMode')"
      prop="mode"
      required
    >
      <el-select
        v-model="form.mode"
        :disabled="isFormItemDisabled('mode')"
        id="mode"
        class="mode"
      >
        <el-option
          v-for="op in modeOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </cl-form-item>
    <cl-form-item
      v-if="form.mode === TASK_MODE_SELECTED_NODES"
      :span="2"
      :label="t('components.spider.form.selectedNodes')"
      prop="node_ids"
      required
    >
      <el-select
        v-model="form.node_ids"
        multiple
        :placeholder="t('components.spider.form.selectedNodes')"
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
    <!--./Row-->

    <cl-form-item
      v-if="form.mode !== TASK_MODE_RANDOM"
      :label="t('components.task.form.toRunNodes')"
      :span="4"
    >
      <cl-node-tag v-for="n in toRunNodes" :key="n.key" :node="n" />
    </cl-form-item>

    <!-- Row -->
    <cl-form-item
      :span="2"
      :label="t('components.spider.form.priority')"
      prop="priority"
    >
      <el-select
        v-model="form.priority"
        :placeholder="t('components.spider.form.priority')"
        :disabled="isFormItemDisabled('priority')"
        id="priority"
        class-name="priority"
      >
        <el-option
          v-for="op in priorityOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('components.spider.form.resultsCollection')"
      prop="col_name"
      required
    >
      <el-input
        v-model="form.col_name"
        :disabled="isFormItemDisabled('col_name')"
        :placeholder="t('components.spider.form.resultsCollection')"
        id="col_name"
        class="col_name"
        @input="onDataCollectionInput"
        @select="onDataCollectionSuggestionSelect"
      />
    </cl-form-item>
    <!-- ./Row -->

    <!--Row-->
    <cl-form-item
      :span="4"
      :label="t('components.spider.form.description')"
      prop="description"
    >
      <el-input
        v-model="form.description"
        :disabled="isFormItemDisabled('description')"
        :placeholder="t('components.spider.form.description')"
        type="textarea"
        id="description"
        class="description"
      />
    </cl-form-item>
    <!--./Row-->

    <slot name="footer" />
  </cl-form>
</template>

<style scoped>
.icon-wrapper {
  display: inline-block;
  text-align: center;
  width: 18px;
  margin-right: 2px;
}
</style>
