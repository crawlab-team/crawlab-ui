<script setup lang="ts">
defineOptions({ name: 'ClCreateGitBranchDialog' });
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import useGitDetail from '@/views/git/detail/useGitDetail';
import { translate } from '@/utils';

const t = translate;

// store
const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;
const {
  activeId,
  gitCurrentBranch,
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
    return !localBranch || localBranch.name !== gitCurrentBranch.value;
  })
);

const internalRemoteBranch = ref<string>();
watch(filteredRemoteBranches, () => {
  internalRemoteBranch.value = filteredRemoteBranches.value?.[0]?.name;
});

const onConfirm = async () => {
  store.dispatch(`${ns}/gitCheckoutBranch`, { id: activeId.value });
};

const onClose = () => {
  store.commit(`${ns}/hideDialog`);
};
</script>

<template>
  <cl-dialog
    :visible="visible"
    :title="t('components.git.branches.new')"
    @confirm="onConfirm"
    @close="onClose"
  >
    <cl-form>
      <cl-form-item :span="4" :label="t('components.git.branches.remote')">
        <el-select v-model="internalRemoteBranch">
          <el-option
            v-for="branch in filteredRemoteBranches"
            :key="branch.hash"
            :label="branch.name"
            :value="branch.name"
          />
        </el-select>
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>

<style lang="scss" scoped></style>
