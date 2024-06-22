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
  (e: 'delete', value: string): void;
  (e: 'new-branch'): void;
  (e: 'delete-branch', value: string): void;
  (e: 'new-tag'): void;
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

const onNewBranch = () => {
  selectRef.value?.blur();
  emit('new-branch');
};

const onNewTag = () => {
  selectRef.value?.blur();
  emit('new-tag');
};

const onDeleteBranch = (value: string, event: Event) => {
  event.stopPropagation();
  selectRef.value?.blur();
  emit('delete-branch', value);
};
</script>

<template>
  <div class="git-branch-select" :class="className">
    <el-select
      ref="selectRef"
      popper-class="git-branch-select-dropdown"
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
        <div class="branch-wrapper">
          <div class="icon-wrapper">
            <cl-icon :icon="['fa', 'code-branch']" />
            <span>{{ op.label }}</span>
          </div>
          <span class="remote">
            {{ getRemoteBranchFromLocalBranch(op.branch)?.name }}
          </span>
          <div class="actions">
            <cl-fa-icon-button
              :icon="['fa', 'trash']"
              size="small"
              type="danger"
              :disabled="model === op.value"
              @click="
                (event: Event) => onDeleteBranch(op.value as string, event)
              "
            />
          </div>
        </div>
      </el-option>
      <el-option-group :label="t('components.git.branches.remote')">
        <el-option
          v-for="op in remoteBranchOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        >
          <div class="branch-wrapper">
            <div class="icon-wrapper">
              <cl-icon :icon="['fa', 'code-branch']" />
              <span>{{ op.label }}</span>
            </div>
          </div>
        </el-option>
      </el-option-group>

      <template #footer>
        <ul class="el-select-dropdown__list">
          <li class="el-select-dropdown__item" @click="onNewBranch">
            <div>
              <cl-icon :icon="['fa', 'plus']" />
              <span>
                {{ t('components.git.branches.new') }}
              </span>
            </div>
          </li>
          <li v-if="false" class="el-select-dropdown__item" @click="onNewTag">
            <div>
              <cl-icon :icon="['fa', 'plus']" />
              <span>
                {{ t('components.git.tags.new') }}
              </span>
            </div>
          </li>
        </ul>
      </template>
    </el-select>
  </div>
</template>

<style scoped lang="scss">
.git-branch-select {
  min-width: 150px;
  margin-right: 10px;
}
</style>
<style lang="scss">
.git-branch-select-dropdown {
  .branch-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;

    .icon-wrapper {
      .icon {
        margin-right: 5px;
      }
    }

    .remote {
      color: var(--cl-disabled-color);
      font-weight: normal;
    }

    .actions {
      height: 100%;
      position: absolute;
      right: 0;
      display: none;
      align-items: center;

      .button-wrapper {
        cursor: pointer;
        color: var(--el-text-color);
        margin-left: 3px;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &:hover {
      .remote {
        visibility: hidden;
      }

      .actions {
        display: flex;
      }
    }
  }

  .el-select-dropdown__footer {
    padding: 0;

    .el-select-dropdown__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;

      &:hover {
        background-color: var(--el-fill-color-light);
      }

      .icon {
        margin-right: 5px;
      }
    }
  }
}
</style>
