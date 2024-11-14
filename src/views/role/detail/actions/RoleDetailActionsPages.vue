<script setup lang="ts">
import { useStore } from 'vuex';
import { getIconByTabName, translate } from '@/utils';
import { TAB_NAME_PAGES } from '@/constants';

const t = translate;

const ns: ListStoreNamespace = 'role';
const store = useStore();
const { role: state } = store.state as RootStoreState;

const onClickCheckAll = () => {
  const status =
    state.pagesCheckAllStatus === 'unchecked' ||
    state.pagesCheckAllStatus === 'indeterminate'
      ? 'checked'
      : 'unchecked';
  store.commit(`${ns}/setPagesCheckAllStatus`, status);
};

defineOptions({ name: 'ClRoleDetailActionsPages' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon :icon="getIconByTabName(TAB_NAME_PAGES)" />
    <cl-nav-action-item>
      <el-checkbox
        :model-value="state.pagesCheckAllStatus === 'checked'"
        :indeterminate="state.pagesCheckAllStatus === 'indeterminate'"
        :label="t('common.actions.checkAll')"
        :disabled="state.form.root_admin"
        @click="onClickCheckAll"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>
