<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import useGitDetail from '@/views/git/detail/useGitDetail';
import { translate } from '@/utils';
import { ElMessage } from 'element-plus';

const t = translate;

const store = useStore();
const { git: state } = store.state as RootStoreState;

// git form
const gitForm = computed<Git>(() => state.form);

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
  await ElMessage.success(t('common.message.success.save'));
};
</script>

<template>
  <cl-detail-layout store-namespace="git">
    <template #actions>
      <cl-nav-action-group>
        <cl-nav-action-fa-icon
          :icon="['fa', 'code-branch']"
          :tooltip="t('components.git.actions.title')"
        />
        <cl-nav-action-item>
          <cl-fa-icon-button
            :icon="['fa', 'download']"
            :tooltip="t('components.git.actions.tooltip.pull')"
            type="primary"
            :disabled="!gitForm.url || !gitForm.auth_type"
            @click="onClickPull"
          />
          <cl-fa-icon-button
            :icon="['fa', 'upload']"
            :tooltip="t('components.git.actions.tooltip.commit')"
            type="success"
            :disabled="!gitForm.url || !gitForm.auth_type"
            @click="onClickCommit"
          />
          <div
            v-if="gitCurrentBranch || gitCurrentBranchLoading"
            class="branch"
          >
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
                <span
                  style="color: #409eff; margin-left: 5px; font-weight: bolder"
                >
                  {{ gitCurrentBranch }}
                </span>
              </template>
            </cl-tag>
          </div>
          <cl-switch
            v-model="gitForm.auto_pull"
            :active-text="t('components.git.form.autoPull')"
            :disabled="gitForm.url === '' || gitForm.auth_type === ''"
            @change="onAutoPullChange"
          />
        </cl-nav-action-item>
      </cl-nav-action-group>
      <!--      <cl-nav-action-group>-->
      <!--        <el-radio-group-->
      <!--          v-if="activeTabKey === 'references'"-->
      <!--          v-model="internalGitRefType"-->
      <!--          class="ref-type-select"-->
      <!--          @change="onRefTypeChange"-->
      <!--        >-->
      <!--          <el-radio-button :label="GIT_REF_TYPE_BRANCH">-->
      <!--            <el-tooltip :content="t('components.git.references.type.branch')">-->
      <!--              <font-awesome-icon :icon="['fa', 'code-branch']"/>-->
      <!--            </el-tooltip>-->
      <!--          </el-radio-button>-->
      <!--          <el-radio-button :label="GIT_REF_TYPE_TAG">-->
      <!--            <el-tooltip :content="t('components.git.references.type.tag')">-->
      <!--              <font-awesome-icon :icon="['fa', 'tag']"/>-->
      <!--            </el-tooltip>-->
      <!--          </el-radio-button>-->
      <!--        </el-radio-group>-->
      <!--        <cl-label-button-->
      <!--          id="checkout-btn"-->
      <!--          class-name="checkout-btn"-->
      <!--          :type="!loading.checkout ? 'primary' : 'warning'"-->
      <!--          :icon="!loading.checkout ? ['fa', 'code-branch'] : null"-->
      <!--          :label="t('components.git.actions.label.checkout')"-->
      <!--          :tooltip="t('components.git.actions.tooltip.checkout')"-->
      <!--          :disabled="!gitForm.url || !gitForm.auth_type"-->
      <!--          :loading="loading.checkout"-->
      <!--          @click="onClickCheckout"-->
      <!--        />-->
      <!--        <cl-label-button-->
      <!--          id="pull-btn"-->
      <!--          class-name="pull-btn"-->
      <!--          :type="!loading.pull ? 'primary' : 'warning'"-->
      <!--          :icon="!loading.pull ? ['fa', 'download'] : null"-->
      <!--          :label="t('components.git.actions.label.pull')"-->
      <!--          :tooltip="t('components.git.actions.tooltip.pull')"-->
      <!--          :disabled="!gitForm.url || !gitForm.auth_type"-->
      <!--          :loading="loading.pull"-->
      <!--          @click="onClickPull"-->
      <!--        />-->
      <!--        <cl-label-button-->
      <!--          id="commit-btn"-->
      <!--          class-name="commit-btn"-->
      <!--          :type="!loading.commit ? 'success' : 'warning'"-->
      <!--          :icon="!loading.commit ? ['fa', 'paper-plane'] : null"-->
      <!--          :label="t('components.git.actions.label.commit')"-->
      <!--          :tooltip="t('components.git.actions.tooltip.commit')"-->
      <!--          :disabled="!gitChangeSelection?.length"-->
      <!--          :loading="loading.commit"-->
      <!--          @click="onClickCommit"-->
      <!--        />-->
      <!--      </cl-nav-action-group>-->
    </template>
  </cl-detail-layout>
</template>

<style scoped lang="scss"></style>
