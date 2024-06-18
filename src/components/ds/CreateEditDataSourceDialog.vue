<template>
  <cl-create-edit-dialog
    :action-functions="actionFunctions"
    :batch-form-data="formList"
    :batch-form-fields="batchFormFields"
    :confirm-disabled="confirmDisabled"
    :confirm-loading="confirmLoading"
    :tab-name="createEditDialogTabName"
    :type="activeDialogKey"
    :visible="createEditDialogVisible"
    no-batch
  >
    <template #default>
      <cl-data-source-form />
    </template>
  </cl-create-edit-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataSourceForm from '@/components/ds/DataSourceForm.vue';
import useDataSource from '@/components/ds/useDataSource';
import { getStore } from '@/store';

export default defineComponent({
  name: 'CreateEditDataSourceDialog',
  setup() {
    // store
    const store = getStore();

    return {
      ...useDataSource(store),
    };
  },
});
</script>

<style lang="scss" scoped></style>
