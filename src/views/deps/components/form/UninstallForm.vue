<script setup lang="ts">
defineOptions({ name: 'ClUninstallForm' });
import { ref } from 'vue';
import { translate } from '@/utils';

defineProps<{
  visible?: boolean;
  names?: string[];
  nodes?: any[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm', data: { mode: string; nodeIds: string[] }): void;
  (e: 'close'): void;
}>();

const t = translate;

const mode = ref('all');
const nodeIds = ref([]);

const reset = () => {
  mode.value = 'all';
  nodeIds.value = [];
};

const onConfirm = () => {
  emit('confirm', {
    mode: mode.value,
    nodeIds: nodeIds.value,
  });
  reset();
};

const onClose = () => {
  emit('close');
  reset();
};
</script>

<template>
  <cl-dialog
    :title="t('common.actions.uninstall')"
    :visible="visible"
    width="640px"
    :confirm-loading="loading"
    @confirm="onConfirm"
    @close="onClose"
  >
    <cl-form>
      <cl-form-item :span="4" :label="t('views.env.deps.dependency.form.name')">
        <cl-tag
          v-for="n in names"
          :key="n"
          class="dep-name"
          type="primary"
          :label="n"
          size="small"
        />
      </cl-form-item>
      <cl-form-item :span="4" :label="t('views.env.deps.dependency.form.mode')">
        <el-select v-model="mode">
          <el-option
            value="all"
            :label="t('views.env.deps.dependency.form.allNodes')"
          />
          <el-option
            value="selected-nodes"
            :label="t('views.env.deps.dependency.form.selectedNodes')"
          />
        </el-select>
      </cl-form-item>
      <cl-form-item
        v-if="mode === 'selected-nodes'"
        :span="4"
        :label="t('views.env.deps.dependency.form.selectedNodes')"
      >
        <el-select
          v-model="nodeIds"
          multiple
          :placeholder="t('views.env.deps.dependency.form.selectedNodes')"
        >
          <el-option
            v-for="n in nodes"
            :key="n.key"
            :value="n._id"
            :label="n.name"
          />
        </el-select>
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>

<style scoped>
.dep-name {
  margin-right: 10px;
}
</style>
