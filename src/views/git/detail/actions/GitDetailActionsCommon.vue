<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import useGitDetail from '@/views/git/detail/useGitDetail';
import { ElMessage, ElMessageBox, ElSelect } from 'element-plus';
import { GIT_STATUS_READY } from '@/constants';
import ClFormItem from '@/components/form/FormItem.vue';

const t = translate;

const ns = 'git';
const store = useStore();
const { git: state } = store.state as RootStoreState;

// git form
const gitForm = computed<Git>(() => state.form);

const isDisabled = computed<boolean>(
  () =>
    gitForm.value.status !== GIT_STATUS_READY ||
    !gitForm.value.url ||
    !gitForm.value.auth_type
);

const gitCurrentBranchRef = ref<typeof ElSelect>();

const {
  gitCurrentBranch,
  gitDataLoading,
  gitLocalBranches,
  gitLocalBranchesDict,
  gitRemoteBranches,
  gitRemoteBranchesDict,
  onClickPull,
  onClickCommit,
} = useGitDetail();

const isBranchClicked = ref<boolean>(false);

const getRemoteBranchFromLocalBranch = (localBranch: GitRef) => {
  if (!localBranch.hash) return;
  return gitRemoteBranchesDict.value[localBranch.hash]?.name;
};

const onClickNewBranch = () => {
  gitCurrentBranchRef.value?.blur();
  store.commit(`${ns}/showDialog`, 'createBranch');
};

const onBranchClick = () => {
  isBranchClicked.value = true;
};

const onBranchCancel = () => {
  isBranchClicked.value = false;
};

const onBranchCheckout = () => {
  isBranchClicked.value = false;
};

const onAutoPullChange = async () => {
  await store.dispatch(`${ns}/updateById`, {
    id: gitForm.value._id,
    form: gitForm.value,
  });
  ElMessage.success(t('common.message.success.save'));
};
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon
      :icon="['fa', 'code-branch']"
      :tooltip="t('components.git.actions.title')"
    />
    <cl-nav-action-item>
      <cl-git-status
        size="large"
        :id="gitForm._id"
        :status="gitForm.status"
        :error="gitForm.error"
      />
      <div class="branch">
        <el-select
          ref="gitCurrentBranchRef"
          class="current-branch"
          :model-value="gitCurrentBranch"
          :disabled="isDisabled || gitDataLoading"
          :placeholder="t('common.status.loading')"
        >
          <template #label="{ label, value }">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <span style="flex: 0; margin-right: 10px">
                <cl-icon :icon="['fa', 'code-branch']" />
              </span>
              <span style="flex: 1">{{ label }}</span>
            </div>
          </template>
          <el-option
            v-for="branch in gitLocalBranches"
            :key="branch.hash"
            :label="branch.name"
            :value="branch.name"
          >
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 24px;
              "
            >
              <span>{{ branch.name }}</span>
              <span
                style="color: var(--cl-disabled-color); font-weight: normal"
              >
                {{ getRemoteBranchFromLocalBranch(branch) }}
              </span>
            </div>
          </el-option>
          <template #footer>
            <cl-button type="default" @click="onClickNewBranch">
              {{ t('components.git.branches.new') }}
            </cl-button>
          </template>
        </el-select>
      </div>
      <cl-fa-icon-button
        :icon="['fa', 'download']"
        :tooltip="t('components.git.actions.tooltip.pull')"
        type="primary"
        :disabled="isDisabled"
        @click="onClickPull"
      />
      <cl-fa-icon-button
        :icon="['fa', 'upload']"
        :tooltip="t('components.git.actions.tooltip.commit')"
        type="success"
        :disabled="isDisabled"
        @click="onClickCommit"
      />
      <!--      <cl-switch-->
      <!--        v-model="gitForm.auto_pull"-->
      <!--        :active-text="t('components.git.form.autoPull')"-->
      <!--        :disabled="gitForm.url === '' || gitForm.auth_type === ''"-->
      <!--        @change="onAutoPullChange"-->
      <!--      />-->
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped lang="scss">
.current-branch {
  width: 120px;
  margin-right: 10px;
}
</style>
