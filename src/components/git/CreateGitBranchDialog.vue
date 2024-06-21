<script setup lang="ts">
defineOptions({ name: 'ClCreateGitBranchDialog' });
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import useGitDetail from '@/views/git/detail/useGitDetail';
import Form from '@/components/form/Form.vue';

const t = translate;

// store
const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;
const {
  activeId,
  currentBranch,
  gitRemoteBranches,
  gitLocalBranchesDict,
  gitRemoteBranchesDict,
} = useGitDetail();

const visible = computed<boolean>(
  () => state.activeDialogKey === 'createBranch'
);

const filteredRemoteBranches = computed(() =>
  gitRemoteBranches.value?.filter(branch => {
    if (!branch.hash) return;
    const localBranch = gitLocalBranchesDict.value[branch.hash];
    return !localBranch || localBranch.name !== currentBranch.value;
  })
);

const formRef = ref<typeof Form>();
const form = ref<{
  remoteBranch: string;
  localBranch: string;
}>({
  remoteBranch: '',
  localBranch: '',
});
watch(filteredRemoteBranches, () => {
  form.value.remoteBranch = filteredRemoteBranches.value?.[0]?.name || '';
});
watch(
  () => form.value.remoteBranch,
  () => {
    form.value.localBranch = form.value.remoteBranch?.split('/')?.pop() || '';
  }
);

const confirmLoading = ref(false);
const onConfirm = async () => {
  await formRef.value?.validate();
  confirmLoading.value = true;
  try {
    const { localBranch, remoteBranch } = form.value;
    await store.dispatch(`${ns}/checkoutBranch`, {
      id: activeId.value,
      localBranch,
      remoteBranch,
    });
  } finally {
    confirmLoading.value = false;
    store.commit(`${ns}/hideDialog`);
    await store.dispatch(`${ns}/getGit`, { id: activeId.value });
  }
};

const onClose = () => {
  store.commit(`${ns}/hideDialog`);
};
</script>

<template>
  <cl-dialog
    :visible="visible"
    :title="t('components.git.branches.new')"
    :confirm-loading="confirmLoading"
    @confirm="onConfirm"
    @close="onClose"
  >
    <cl-form ref="formRef" :model="form">
      <cl-form-item
        prop="remoteBranch"
        :span="4"
        :label="t('components.git.branches.remote')"
        required
      >
        <el-select v-model="form.remoteBranch">
          <el-option
            v-for="branch in filteredRemoteBranches"
            :key="branch.hash"
            :label="branch.name"
            :value="branch.name"
          />
        </el-select>
      </cl-form-item>
      <cl-form-item
        prop="localBranch"
        :span="4"
        :label="t('components.git.branches.local')"
        required
      >
        <el-input v-model="form.localBranch" />
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>

<style lang="scss" scoped></style>
