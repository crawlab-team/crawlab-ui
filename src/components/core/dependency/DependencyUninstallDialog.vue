<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';

const t = translate;

const ns: ListStoreNamespace = 'dependency';
const store = useStore();
const { dependency: state, node: nodeState } = store.state as RootStoreState;

const activeNodes = computed(() => nodeState.allList.filter(n => n.active));

const toUninstallNodes = computed(() => {
  const { mode, node_ids } = state.uninstallForm;
  if (mode === 'all') return activeNodes.value;
  return activeNodes.value.filter(n => node_ids?.includes(n._id!));
});

const visible = computed(() => state.activeDialogKey === 'uninstall');

const form = computed(() => state.uninstallForm);

const loading = computed(() => state.installLoading);

const versions = computed(() => state.versions);
const getVersionsLoading = computed(() => state.getVersionsLoading);

const confirmButtonDisabled = computed(() => {
  if (loading.value) return true;
  return toUninstallNodes.value.length === 0;
});
const onConfirm = async () => {
  if (confirmButtonDisabled.value) return;
  await store.dispatch(`${ns}/uninstallDependency`);
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

defineOptions({ name: 'ClDependencyUninstallDialog' });
</script>

<template>
  <cl-dialog
    :title="t('common.actions.uninstall')"
    :visible="visible"
    width="640px"
    :confirm-loading="loading"
    :confirm-disabled="confirmButtonDisabled"
    @confirm="onConfirm"
    @close="onClose"
  >
    <cl-form>
      <cl-form-item :span="4" :label="t('views.env.deps.dependency.form.name')">
        <cl-tag
          v-for="name in form.names"
          :key="name"
          class="dep-name"
          type="primary"
          :label="name"
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
        required
      >
        <el-select
          v-model="form.node_ids"
          multiple
          :placeholder="t('views.env.deps.dependency.form.selectedNodes')"
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
        :label="t('views.env.deps.dependency.form.toUninstallNodes')"
      >
        <template v-if="toUninstallNodes.length > 0">
          <cl-node-tag v-for="n in toUninstallNodes" :key="n.key" :node="n" />
        </template>
        <template v-else>
          <cl-tag type="info" :label="t('common.placeholder.empty')" />
        </template>
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>
