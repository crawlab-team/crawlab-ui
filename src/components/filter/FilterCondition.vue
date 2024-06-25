<script setup lang="ts">
defineOptions({ name: 'ClFilterCondition' });
import { conditionTypesOptions } from '@/components/filter/filter';
import { computed } from 'vue';
import { FILTER_OP_NOT_SET } from '@/constants/filter';

const props = defineProps<{
  condition?: FilterConditionData;
}>();

const emit = defineEmits<{
  (e: 'change', condition?: FilterConditionData): void;
  (e: 'delete'): void;
}>();

const isInvalidValue = computed<boolean>(() => {
  const { condition } = props;
  if (condition?.op === FILTER_OP_NOT_SET) {
    return false;
  }
  return !condition?.value;
});

const onTypeChange = (conditionType: string) => {
  const { condition } = props;
  if (condition) {
    condition.op = conditionType;
    if (condition.op === FILTER_OP_NOT_SET) {
      condition.value = undefined;
    }
  }
  emit('change', condition);
};

const onValueChange = (conditionValue: string) => {
  const { condition } = props;
  if (condition) {
    condition.value = conditionValue;
  }
  emit('change', condition);
};

const onDelete = () => {
  emit('delete');
};
</script>

<template>
  <div class="filter-condition">
    <el-select
      :model-value="condition?.op"
      :popper-append-to-body="false"
      class="filter-condition-type"
      @change="onTypeChange"
    >
      <el-option
        v-for="op in conditionTypesOptions"
        :key="op.value"
        :label="op.label"
        :value="op.value"
      />
    </el-select>
    <el-input
      :model-value="condition?.value"
      class="filter-condition-value"
      :class="isInvalidValue ? 'invalid' : ''"
      placeholder="Value"
      :disabled="condition?.op === FILTER_OP_NOT_SET"
      @input="onValueChange"
    />
    <el-tooltip content="Delete Condition">
      <el-icon class="icon" name="circle-close" @click="onDelete" />
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.filter-condition {
  display: flex;
  align-items: center;

  .filter-condition-type {
    min-width: 180px;
  }

  .filter-condition-value {
    flex: 1;
  }

  .icon {
    cursor: pointer;
    margin-left: 5px;
  }
}
</style>
