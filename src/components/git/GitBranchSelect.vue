<script setup lang="ts">
defineOptions({ name: 'ClGitBranchSelect' });
import { computed, ref, watch } from 'vue';
import { emptyArrayFunc, translate } from '@/utils';

const model = defineModel<string>();

const props = withDefaults(
  defineProps<{
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
  (e: 'select-local', value: string): void;
  (e: 'select-remote', value: string): void;
}>();

const t = translate;

const getRemoteBranchFromLocalBranch = (localBranch: GitRef) => {
  const { remoteBranches } = props;
  if (!localBranch.hash) return;
  return remoteBranches.find(
    remoteBranch => remoteBranch.hash === localBranch.hash
  );
};

const getLocalBranchFromRemoteBranch = (remoteBranch: GitRef) => {
  const { localBranches } = props;
  if (!remoteBranch.hash) return;
  return localBranches.find(
    localBranch => localBranch.hash === remoteBranch.hash
  );
};

const localBranchOptions = computed(() => {
  const { localBranches } = props;
  return localBranches.map(branch => {
    return {
      value: branch.name,
      label: branch.name,
      branch,
    };
  });
});

const remoteBranchOptions = computed(() => {
  const { remoteBranches } = props;
  return remoteBranches
    .filter(branch => !getLocalBranchFromRemoteBranch(branch))
    .map(branch => {
      return {
        value: branch.name,
        label: branch.name,
        branch,
      };
    });
});

const selectRef = ref<HTMLElement>();

const onSelect = (value: string) => {
  const localBranch = localBranchOptions.value.find(
    branch => branch.value === value
  );
  if (localBranch) {
    emit('select-local', localBranch.value || '');
  } else {
    emit('select-remote', value);
  }
};
</script>

<template>
  <div ref="selectRef" class="git-branch-select">
    <el-select
      :class="className"
      v-model="model"
      :disabled="disabled || loading"
      :placeholder="t('components.git.branches.select')"
      @change="onSelect"
    >
      <template #label="{ label }">
        <div>
          <cl-icon v-if="!loading" :icon="['fa', 'code-branch']" />
          <cl-icon v-else :icon="['fa', 'spinner']" spinning />
          <span style="margin-left: 5px">{{ label }}</span>
        </div>
      </template>
      <el-option
        v-for="op in localBranchOptions"
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
      <el-option-group :label="t('components.git.branches.remote')">
        <el-option
          v-for="op in remoteBranchOptions"
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
          </div>
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>

<style scoped lang="scss">
.git-branch-select {
  min-width: 150px;
  margin-right: 10px;
}
</style>
