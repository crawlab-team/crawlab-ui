<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import useRequest from '@/services/request';
import { ClForm, useNode } from '@/components';

const t = translate;

const { get } = useRequest();

const ns: ListStoreNamespace = 'dependency';
const store = useStore();
const { dependency: state } = store.state as RootStoreState;

const formRef = ref<typeof ClForm>();

const config = computed(() => state.config);
const lang = computed(() => state.lang);

const activeConfigSetup = computed(() => state.activeConfigSetup);

const { activeNodesSorted: activeNodes } = useNode(store);

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

const versions = computed(() => state.configVersions);
const getVersionsLoading = computed(() => state.getConfigVersionsLoading);

const confirmButtonDisabled = computed(() => {
  if (loading.value) return true;
  if (toInstallNodes.value.length === 0) return true;
  if (getVersionsLoading.value) return true;
  if (needsNodeSetupForBrowser.value) return true;
  return false;
});
const onConfirm = async () => {
  // Skip if the confirm button is disabled
  if (confirmButtonDisabled.value) return;

  // Validate form
  await formRef.value?.validate();

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
  if (visible.value) {
    await store.dispatch(`${ns}/getDependencyConfigVersions`);
    store.commit(`${ns}/setSetupForm`, {
      ...form.value,
      version: state.configVersions[0],
    });
  } else {
    store.commit(`${ns}/resetSetupForm`);
    store.commit(`${ns}/resetActiveConfigSetup`);
    store.commit(`${ns}/resetConfigVersions`);

    // special handling for browser
    if (lang.value === 'browser') {
      await getNodeConfig();
    }
  }
});

const nodeConfig = ref<DependencyConfig>();
const getNodeConfig = async () => {
  if (!config.value) return;
  const res = await get(`/dependencies/configs/node`);
  nodeConfig.value = res.data;
};
watch(lang, async () => {
  if (lang.value === 'browser') {
    await getNodeConfig();
  }
});
const needsNodeSetupForBrowser = computed(
  () => lang.value === 'browser' && !nodeConfig.value?.setup
);

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
    <cl-form ref="formRef" :model="form">
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
        required
        prop="version"
      >
        <el-select
          v-model="form.version"
          :disabled="getVersionsLoading"
          :placeholder="t('common.status.loading')"
          default-first-option
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
      <cl-form-item
        :label="t('views.env.deps.dependency.form.toInstallNodes')"
        :span="4"
      >
        <template v-if="toInstallNodes.length > 0">
          <cl-node-tag v-for="n in toInstallNodes" :key="n.key" :node="n" />
        </template>
        <template v-else>
          <cl-tag type="info" :label="t('common.placeholder.empty')" />
        </template>
      </cl-form-item>
      <cl-form-item v-if="needsNodeSetupForBrowser" :span="4">
        <el-alert type="warning" :closable="false">
          <div>
            {{
              t('views.env.deps.config.alert.browser.nodeSetupRequired.content')
            }}
          </div>
          <div>
            <cl-label-button
              :icon="['fab', 'node-js']"
              :label="
                t(
                  'views.env.deps.config.alert.browser.nodeSetupRequired.action'
                )
              "
              @click="
                () => {
                  store.commit(`${ns}/setLang`, 'node');
                  store.commit(`${ns}/setRepoTabName`, 'nodes');
                  store.commit(`${ns}/hideDialog`);
                }
              "
            />
          </div>
        </el-alert>
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>
