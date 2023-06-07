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
      <cl-environment-form/>
    </template>
  </cl-create-edit-dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import useEnvironment from '@/components/environment/useEnvironment';
import {getStore} from "@/store";

export default defineComponent({
  name: 'CreateEditEnvironmentDialog',
  setup() {
    // store
    const store = getStore();

    return {
      ...useEnvironment(store),
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
