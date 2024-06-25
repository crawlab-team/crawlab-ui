<script setup lang="ts">
defineOptions({ name: 'ClGitDetailActionsSpiders' });

import { ref } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { translate } from '@/utils';
import useGitDetail from '@/views/git/detail/useGitDetail';
import useSpider from '@/components/spider/useSpider';
import ClCreateGitSpiderDialog from '@/components/git/CreateGitSpiderDialog.vue';

const t = translate;

const ns = 'git';
const store = useStore<RootStoreState>();

const { form: spiderForm } = useSpider(store);

const { activeId, isDisabled } = useGitDetail();

const dialogVisible = ref(false);

const onOpenCreateDialog = () => {
  store.commit(`spider/resetForm`);
  dialogVisible.value = true;
};

const createLoading = ref(false);
const onCreate = async (spider: Spider) => {
  createLoading.value = true;
  try {
    await store.dispatch(`${ns}/createSpider`, { id: activeId.value, spider });
  } catch (e) {
    ElMessage.error(e.message);
  } finally {
    createLoading.value = false;
    dialogVisible.value = false;
  }
};
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon
      :icon="['fa', 'spider']"
      :tooltip="t('components.git.spiders.title')"
    />
    <cl-nav-action-item>
      <cl-label-button
        :loading="createLoading"
        :icon="['fa', 'plus']"
        :tooltip="t('components.git.spiders.actions.tooltip.create')"
        :label="t('components.git.spiders.actions.label.create')"
        type="success"
        :disabled="isDisabled"
        @click="onOpenCreateDialog"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>

  <cl-create-git-spider-dialog
    :title="t('components.git.spiders.actions.label.create')"
    :visible="dialogVisible"
    :loading="createLoading"
    @close="dialogVisible = false"
    @confirm="onCreate"
  />
</template>

<style scoped lang="scss"></style>
