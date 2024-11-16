<script setup lang="ts">
import { getDefaultFilterCondition } from '@/components/ui/filter/filter';

const props = defineProps<{
  conditions?: FilterConditionData[];
}>();

const emit = defineEmits<{
  (e: 'change', conditions: FilterConditionData[]): void;
}>();

const onChange = (index: number, condition: FilterConditionData) => {
  const { conditions } = props as FilterConditionListProps;
  conditions[index] = condition;
  emit('change', conditions);
};

const onDelete = (index: number) => {
  const { conditions } = props as FilterConditionListProps;
  conditions.splice(index, 1);
  if (conditions.length === 0) {
    conditions.push(getDefaultFilterCondition());
  }
  emit('change', conditions);
};
defineOptions({ name: 'ClFilterConditionList' });
</script>

<template>
  <ul class="filter-condition-list">
    <li
      v-for="(cond, $index) in conditions"
      :key="$index"
      class="filter-condition-item"
    >
      <cl-filter-condition
        :condition="cond"
        @change="onChange($index, $event)"
        @delete="onDelete($index)"
      />
    </li>
  </ul>
</template>

<style scoped>
.filter-condition-list {
  list-style: none;
  padding: 0;
  margin: 0;

  .filter-condition-item {
    margin-bottom: 10px;
  }
}
</style>
