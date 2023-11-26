<template>
  <cl-form v-if="form" ref="formRef" :model="form">
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
      >
        <el-option
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
      :label="t('components.spider.form.incrementalSync')"
      prop="incremental_sync"
    >
      <cl-switch
        v-model="form.incremental_sync"
      />
    </cl-form-item>
    <!-- ./Row -->

    <!-- Row -->
    <cl-form-item
      :span="2"
      :offset="2"
      :label="t('components.spider.form.autoInstall')"
      prop="auto_install"
    >
      <cl-switch
        v-model="form.auto_install"
        :tooltip="systemInfo.edition === 'global.edition.community' ? t('components.spider.form.autoInstallDisabled') : undefined"
        :disabled="systemInfo.edition === 'global.edition.community'"
      />
    </cl-form-item>
    <!-- ./Row -->

    <!-- Row -->
    <cl-form-item
      :span="2"
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
      :span="2"
      :label="t('components.spider.form.resultsCollection')"
      prop="col_name"
      required
    >
      <el-autocomplete
        v-model="form.col_name"
        :disabled="isFormItemDisabled('col_name')"
        :placeholder="t('components.spider.form.resultsCollection')"
        :fetch-suggestions="fetchDataCollectionSuggestions"
        id="col_name"
        class="col_name"
        @input="onDataCollectionInput"
        @select="onDataCollectionSuggestionSelect"
      />
    </cl-form-item>
    <!-- ./Row -->

    <!--Row-->
    <cl-form-item
      v-if="[TASK_MODE_SELECTED_NODES].includes(form.mode)"
      :span="4"
      :label="t('components.spider.form.selectedNodes')"
      prop="node_ids"
      required
    >
      <cl-check-tag-group
        v-model="form.node_ids"
        :options="allNodeSelectOptions"
        :disabled="isFormItemDisabled('node_ids')"
        id="node"
        class-name="nodes"
      />
    </cl-form-item>
    <!--./Row-->

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
  </cl-form>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from 'vue';
import {useStore} from 'vuex';
import useSpider from '@/components/spider/spider';
import useNode from '@/components/node/node';
import useProject from '@/components/project/project';
import {TASK_MODE_SELECTED_NODE_TAGS, TASK_MODE_SELECTED_NODES} from '@/constants/task';
import pinyin, {STYLE_NORMAL} from 'pinyin';
import {isZeroObjectId} from '@/utils/mongo';
import {useI18n} from 'vue-i18n';
import useSpiderDetail from "@/views/spider/detail/useSpiderDetail";
import useTask from "@/components/task/task";

export default defineComponent({
  name: 'SpiderForm',
  setup() {
    // i18n
    const {t} = useI18n();

    // store
    const store = useStore();

    const {
      common: commonState
    } = store.state as RootStoreState;

    const systemInfo = computed<SystemInfo>(() => commonState.systemInfo || {});

    // use node
    const {
      allListSelectOptions: allNodeSelectOptions,
      allTags: allNodeTags,
    } = useNode(store);

    // use project
    const {
      allListSelectOptionsWithEmpty: allProjectSelectOptions,
    } = useProject(store);

    // use task
    const {
      priorityOptions,
    } = useTask(store);

    // use spider
    const {
      form,
    } = useSpider(store);

    // use spider detail
    const {
      activeId,
    } = useSpiderDetail();

    // whether col field of form has been changed
    const isFormColChanged = ref<boolean>(false);

    const onColInput = () => {
      isFormColChanged.value = true;
    };

    watch(() => form.value?.name, () => {
      if (isFormColChanged.value) return;
      if (form.value?._id && isZeroObjectId(form.value?._id)) return;
      if (activeId.value && form.value?.col_name) return;
      if (!form.value.name) {
        form.value.col_name = '';
      } else {
        const name = pinyin(form.value.name, {style: STYLE_NORMAL})
          .map(d => d.join('_'))
          .join('_');
        form.value.col_name = `results_${name}`;
      }
    });

    const onDataCollectionSuggestionSelect = ({_id}: { _id: string; value: string }) => {
      form.value.col_id = _id;
    };

    const onDataCollectionInput = (value: string) => {
      form.value.col_name = value;
      form.value.col_id = undefined;
    };

    return {
      ...useSpider(store),

      // custom
      systemInfo,
      TASK_MODE_SELECTED_NODES,
      TASK_MODE_SELECTED_NODE_TAGS,
      allNodeSelectOptions,
      allNodeTags,
      allProjectSelectOptions,
      priorityOptions,
      onColInput,
      onDataCollectionSuggestionSelect,
      onDataCollectionInput,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
