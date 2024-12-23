<script setup lang="ts">
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';

const t = translate;

const ns: ListStoreNamespace = 'dependency';
const store = useStore();
const { dependency: state, node: nodeState } = store.state as RootStoreState;

const config = computed(() => state.config);

const activeConfigSetup = computed(() => state.activeConfigSetup);

const activeNodes = computed(() => nodeState.allList.filter(n => n.active));

const toInstallNodes = computed(() => {
  const { mode, node_ids, node_id } = state.setupForm;

  if (node_id) {
    // Single node
    return activeNodes.value.filter(n => n._id === node_id);
  } else {
    // Multiple nodes
    if (mode === 'all') {
      // All nodes
      return activeNodes.value;
    }
    // Selected nodes
    return activeNodes.value.filter(n => node_ids?.includes(n._id!));
  }
});

const visible = computed(() => state.activeDialogKey === 'setup');

const form = computed(() => state.setupForm);

const loading = computed(() => state.setupLoading);

const confirmButtonDisabled = computed(() => {
  if (loading.value) return true;
  return toInstallNodes.value.length === 0;
});
const onConfirm = async () => {
  // Skip if the confirm button is disabled
  if (confirmButtonDisabled.value) return;

  // Install config setup
  await store.dispatch(`${ns}/installConfigSetup`, {
    id: activeConfigSetup.value?._id,
  });

  // Hide dialog
  store.commit(`${ns}/hideDialog`);

  // Switch to nodes tab
  if (state.repoTabName !== 'nodes') {
    store.commit(`${ns}/setRepoTabName`, 'nodes');
  }

  // Refresh config setup list
  await store.dispatch(`${ns}/getConfigSetupList`);
};

const onClose = () => {
  store.commit(`${ns}/hideDialog`);
};

watch(visible, async () => {
  if (!visible.value) {
    store.commit(`${ns}/resetSetupForm`);
    store.commit(`${ns}/resetActiveConfigSetup`);
  }
});

defineOptions({ name: 'ClDependencySetupDialog' });
</script>

<template>
  <cl-dialog
    :title="t('common.actions.install')"
    :visible="visible"
    width="640px"
    :confirm-loading="loading"
    :confirm-disabled="confirmButtonDisabled"
    @confirm="onConfirm"
    @close="onClose"
  >
    <cl-form>
      <cl-form-item :span="4" :label="t('views.env.deps.config.form.name')">
        <cl-tag
          :key="config?.name"
          class="dep-name"
          type="primary"
          :label="config?.name"
        />
      </cl-form-item>
      <cl-form-item
        :span="4"
        :label="t('views.env.deps.configSetup.form.version')"
      >
        <el-input
          v-model="form.version"
          :placeholder="t('views.env.deps.configSetup.form.version')"
        />
      </cl-form-item>
      <template v-if="!form.node_id">
        <cl-form-item
          :span="4"
          :label="t('views.env.deps.dependency.form.mode')"
        >
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
      </template>
      <cl-form-item :label="t('views.env.deps.dependency.form.toInstallNodes')">
        <template v-if="toInstallNodes.length > 0">
          <cl-node-tag v-for="n in toInstallNodes" :key="n.key" :node="n" />
        </template>
        <template v-else>
          <cl-tag type="info" :label="t('common.placeholder.empty')" />
        </template>
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>
