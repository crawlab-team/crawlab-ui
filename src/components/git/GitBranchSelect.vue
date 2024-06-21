<script setup lang="ts">
defineOptions({ name: 'ClGitBranchSelect' });

import { computed, ref, watch } from 'vue';
import { emptyArrayFunc, translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    localBranches: GitRef[];
    remoteBranches: GitRef[];
    disabled?: boolean;
    loading?: boolean;
    className?: string;
  }>(),
  {
    localBranches: emptyArrayFunc,
    remoteBranches: emptyArrayFunc,
  }
);

const emit = defineEmits<{
  (e: 'modelValue:update', value: string): void;
  (e: 'change', value: string): void;
}>();

const t = translate;

const getRemoteBranchFromLocalBranch = (localBranch: GitRef) => {
  const { remoteBranches } = props;
  if (!localBranch.hash) return;
  return remoteBranches.find(
    remoteBranch => remoteBranch.hash === localBranch.hash
  );
};

const options = computed(() => {
  const { localBranches } = props;
  return localBranches.map(branch => {
    return {
      value: branch.name,
      label: branch.name,
      branch,
    };
  });
});

const selectRef = ref<HTMLElement>();

const internalValue = ref<string>(props.modelValue);
watch(internalValue, () => emit('modelValue:update', internalValue.value));
watch(
  () => props.modelValue,
  value => {
    internalValue.value = value;
  }
);
</script>

<template>
  <div ref="selectRef" class="git-branch-select">
    <el-select
      :class="className"
      v-model="internalValue"
      :disabled="disabled || loading"
      :placeholder="t('components.git.branches.select')"
      @change="() => emit('change', internalValue)"
    >
      <template #label="{ label }">
        <div>
          <cl-icon v-if="!loading" :icon="['fa', 'code-branch']" />
          <cl-icon v-else :icon="['fa', 'spinner']" spinning />
          <span style="margin-left: 5px">{{ label }}</span>
        </div>
      </template>
      <el-option
        v-for="op in options"
        :key="op.value"
        :label="op.label"
        :value="op.value"
      >
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
          "
        >
          <div>
            <cl-icon :icon="['fa', 'code-branch']" />
            <span style="margin-left: 5px">{{ op.label }}</span>
          </div>
          <span style="color: var(--cl-disabled-color); font-weight: normal">
            {{ getRemoteBranchFromLocalBranch(op.branch)?.name }}
          </span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<style scoped lang="scss">
.git-branch-select {
  min-width: 150px;
  margin-right: 10px;
}
</style>
