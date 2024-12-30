<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';

const t = translate;

const ns: ListStoreNamespace = 'dependency';
const store = useStore();
const { dependency: state, node: nodeState } = store.state as RootStoreState;

const activeNodes = computed(() => nodeState.allList.filter(n => n.active));

const toInstallNodes = computed(() => {
  const { mode, node_ids } = state.installForm;
  if (mode === 'all') return activeNodes.value;
  return activeNodes.value.filter(n => node_ids?.includes(n._id!));
});

const visible = computed(() => state.activeDialogKey === 'config');

const form = computed(() => state.config);
const formRef = ref(null);

const confirmLoading = ref(false);
const onConfirm = async () => {
  await formRef.value?.validate();
  confirmLoading.value = true;
  try {
    await store.dispatch(`${ns}/saveDependencyConfig`);
  } finally {
    confirmLoading.value = false;
    store.commit(`${ns}/hideDialog`);
  }
};

const onClose = () => {
  store.commit(`${ns}/hideDialog`);
};

watch(visible, async () => {
  if (!visible.value) {
    store.commit(`${ns}/resetInstallForm`);
  }
});

defineOptions({ name: 'ClDependencyConfigDialog' });
</script>

<template>
  <cl-dialog
    :title="t('common.actions.configure')"
    :visible="visible"
    width="640px"
    :confirm-loading="confirmLoading"
    @confirm="onConfirm"
    @close="onClose"
  >
    <cl-form v-if="form" ref="formRef" :model="form">
      <cl-form-item
        :span="4"
        :label="t('views.env.deps.config.form.name')"
        prop="name"
      >
        <el-input v-model="form.name" disabled />
      </cl-form-item>
      <cl-form-item
        :span="4"
        :label="t('views.env.deps.config.form.execCmd')"
        prop="exec_cmd"
        required
      >
        <el-input
          v-model="form.exec_cmd"
          :placeholder="t('views.env.deps.config.form.execCmd')"
        />
      </cl-form-item>
      <cl-form-item
        :span="4"
        :label="t('views.env.deps.config.form.pkgCmd')"
        prop="pkg_cmd"
        required
      >
        <el-input
          v-model="form.pkg_cmd"
          :placeholder="t('views.env.deps.config.form.pkgCmd')"
        />
      </cl-form-item>
      <cl-form-item
        :span="4"
        :label="t('views.env.deps.config.form.pkgSrcURL')"
        prop="pkg_src_url"
      >
        <el-input
          v-model="form.pkg_src_url"
          :placeholder="t('views.env.deps.config.form.pkgSrcURL')"
        />
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>
