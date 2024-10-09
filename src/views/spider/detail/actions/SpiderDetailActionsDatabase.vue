<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getStore } from '@/store';
import { EMPTY_OBJECT_ID, translate } from '@/utils';
import useDatabase from '@/components/core/database/useDatabase';

const t = translate;

const store = getStore();
const { spider: state } = store.state;

const form = computed(() => state.form);

const { allListSelectOptions: allDatabaseSelectOptions } = useDatabase(store);

const allDatabaseSelectOptionsWithDefault = computed<SelectOption[]>(() => {
  return [
    { label: t('common.mode.default'), value: EMPTY_OBJECT_ID },
    ...allDatabaseSelectOptions.value,
  ];
});

const onDatabaseChange = async (value: string) => {
  ElMessage.success(t('components.database.message.success.change'));
};

defineOptions({ name: 'ClSpiderDetailActionsDatabase' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon :icon="['fa', 'database']" />
    <template v-if="form">
      <cl-nav-action-item>
        <el-select v-model="form.data_source_id" @change="onDatabaseChange">
          <el-option
            v-for="(op, $index) in allDatabaseSelectOptionsWithDefault"
            :key="$index"
            :label="op.label"
            :value="op.value"
          />
        </el-select>
      </cl-nav-action-item>
    </template>
  </cl-nav-action-group>
</template>
