<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRole } from '@/components';
import { debounce } from 'lodash';

const ns: ListStoreNamespace = 'role';
const store = useStore();
const { role: state } = store.state as RootStoreState;

const { routesOptions } = useRole(store);

const form = computed<Role>(() => state.form);

const checkboxTreeRef = ref();

const updateCheckAllStatus = () => {
  const checkAllStatus = checkboxTreeRef.value?.getCheckAllStatus?.();
  store.commit(`${ns}/setPagesCheckAllStatus`, checkAllStatus);
};

const onRoutesChange = (value: any[]) => {
  store.commit(`${ns}/setForm`, {
    ...form.value,
    routes: value,
  });
  updateCheckAllStatus();
};

watch(() => form.value.routes, debounce(updateCheckAllStatus, 10));

watch(
  () => state.pagesCheckAllStatus,
  (newVal, oldVal) => {
    if (typeof newVal !== 'undefined' && typeof oldVal !== 'undefined') {
      if (newVal === oldVal) return;
      switch (newVal) {
        case 'checked':
          checkboxTreeRef.value?.checkAll?.(true);
          break;
        case 'unchecked':
          checkboxTreeRef.value?.checkAll?.(false);
          break;
      }
    }
  }
);

defineOptions({ name: 'ClRoleDetailTabPages' });
</script>

<template>
  <el-scrollbar>
    <cl-checkbox-tree
      v-if="form._id"
      :key="form._id"
      ref="checkboxTreeRef"
      :model-value="form.routes"
      :options="routesOptions"
      :disabled="form.root_admin"
      :checked-all="form.root_admin || state.pagesCheckAllStatus === 'checked'"
      @change="onRoutesChange"
    />
  </el-scrollbar>
</template>

<style scoped>
.checkbox-tree {
  margin: 0 20px;
  height: 100%;
  overflow: auto;
}
</style>
