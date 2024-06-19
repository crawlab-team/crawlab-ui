<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import useGitDetail from '@/views/git/detail/useGitDetail';
import { ElMessage } from 'element-plus';
import { GIT_STATUS_READY } from '@/constants';

const t = translate;

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

const {
  gitCurrentBranch,
  gitCurrentBranchLoading,
  onClickPull,
  onClickCommit,
} = useGitDetail();

const isBranchClicked = ref<boolean>(false);

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
  await store.dispatch(`git/updateById`, {
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
      <div v-if="gitCurrentBranch || gitCurrentBranchLoading" class="branch">
        <cl-tag
          v-if="gitCurrentBranchLoading"
          class-name="current-branch-loading"
          type="warning"
          :label="t('components.git.common.status.loading.label')"
          :tooltip="t('components.git.common.status.loading.tooltip')"
          :icon="['fa', 'spinner']"
          spinning
          size="large"
        />
        <cl-tag
          v-else
          class-name="current-branch"
          type="primary"
          :icon="['fa', 'code-branch']"
          size="large"
          :label="gitCurrentBranch"
          @click="onBranchClick"
        >
          <template #tooltip>
            <span>{{ t('components.git.common.currentBranch') }}:</span>
            <span style="color: #409eff; margin-left: 5px; font-weight: bolder">
              {{ gitCurrentBranch }}
            </span>
          </template>
        </cl-tag>
      </div>
      <!--      <cl-switch-->
      <!--        v-model="gitForm.auto_pull"-->
      <!--        :active-text="t('components.git.form.autoPull')"-->
      <!--        :disabled="gitForm.url === '' || gitForm.auth_type === ''"-->
      <!--        @change="onAutoPullChange"-->
      <!--      />-->
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style scoped lang="scss"></style>
