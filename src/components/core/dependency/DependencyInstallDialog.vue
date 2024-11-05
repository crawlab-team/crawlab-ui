<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';

const t = translate;

const ns: ListStoreNamespace = 'dependency';
const store = useStore();
const { dependency: state, node: nodeState } = store.state as RootStoreState;

const nodes = computed(() => nodeState.allList);

const visible = computed(() => state.activeDialogKey === 'install');

const form = computed(() => state.installForm);

const loading = computed(() => state.installLoading);

const versions = computed(() => state.versions);
const getVersionsLoading = computed(() => state.getVersionsLoading);

const onConfirm = async () => {
  await store.dispatch(`${ns}/installDependency`);
  store.commit(`${ns}/hideDialog`);
};

const onClose = () => {
  store.commit(`${ns}/hideDialog`);
};

watch(visible, async () => {
  if (visible.value) {
    await store.dispatch(`${ns}/getRepoVersions`);
    store.commit(`${ns}/setInstallForm`, {
      ...form.value,
      version: state.versions[0],
    });
  } else {
    store.commit(`${ns}/resetInstallForm`);
  }
});

defineOptions({ name: 'ClDependencyInstallDialog' });
</script>

<template>
  <cl-dialog
    :title="t('common.actions.install')"
    :visible="visible"
    width="640px"
    :confirm-loading="loading"
    :confirm-disabled="loading"
    @confirm="onConfirm"
    @close="onClose"
  >
    <cl-form>
      <cl-form-item :span="4" :label="t('views.env.deps.dependency.form.name')">
        <cl-tag
          v-for="n in form.names"
          :key="n"
          class="dep-name"
          type="primary"
          :label="n"
          size="small"
        />
      </cl-form-item>
      <cl-form-item :span="4" :label="t('views.env.deps.dependency.form.mode')">
        <el-select v-model="form.mode">
          <el-option
            value="all"
            :label="t('views.env.deps.dependency.form.allNodes')"
          />
          <el-option
            value="selected-nodes"
            :label="t('views.env.deps.dependency.form.selectedNodes')"
          />
        </el-select>
      </cl-form-item>
      <cl-form-item
        v-if="form.mode === 'selected-nodes'"
        :span="4"
        :label="t('views.env.deps.dependency.form.selectedNodes')"
      >
        <el-select
          v-model="form.node_ids"
          multiple
          :placeholder="t('views.env.deps.dependency.form.selectedNodes')"
        >
          <el-option
            v-for="n in nodes"
            :key="n.key"
            :value="n._id"
            :label="n.name"
          />
        </el-select>
      </cl-form-item>
      <cl-form-item
        :span="4"
        :label="t('views.env.deps.dependency.form.version')"
      >
        <el-select
          v-model="form.version"
          :disabled="getVersionsLoading"
          :placeholder="t('common.status.loading')"
          filterable
        >
          <el-option
            v-for="(v, $index) in versions"
            :key="$index"
            :label="v"
            :value="v"
          />
        </el-select>
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>
