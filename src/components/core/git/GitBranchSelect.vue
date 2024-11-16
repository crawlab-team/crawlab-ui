<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { emptyArrayFunc, translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
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
  (e: 'update:modelValue', value: string): void;
  (e: 'select-local', value: string): void;
  (e: 'select-remote', value: string): void;
  (e: 'select-remote', value: string): void;
  (e: 'new-branch'): void;
  (e: 'delete-branch', value: string): void;
  (e: 'new-tag'): void;
  (e: 'pull'): void;
  (e: 'commit'): void;
  (e: 'push'): void;
}>();

const t = translate;

const internalModelValue = ref(props.modelValue);
watch(
  () => props.modelValue,
  value => {
    internalModelValue.value = value;
  }
);
watch(
  () => internalModelValue.value,
  value => {
    emit('update:modelValue', value!);
  }
);

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
    .filter(
      branch =>
        !localBranchOptions.value.some(
          op => op.branch?.remote_track === branch.name
        )
    )
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

const onPull = () => {
  selectRef.value?.blur();
  emit('pull');
};

const onCommit = () => {
  selectRef.value?.blur();
  emit('commit');
};

const onPush = () => {
  selectRef.value?.blur();
  emit('push');
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
defineOptions({ name: 'ClGitBranchSelect' });
</script>

<template>
  <div class="git-branch-select" :class="className">
    <el-select
      ref="selectRef"
      popper-class="git-branch-select-dropdown"
      v-model="internalModelValue"
      :disabled="disabled || loading"
      :placeholder="t('components.git.branches.select')"
      @change="onSelect"
    >
      <!-- label -->
      <template #label="{ label }">
        <div>
          <cl-icon v-if="!loading" :icon="['fa', 'code-branch']" />
          <cl-icon v-else :icon="['fa', 'spinner']" spinning />
          <span style="margin-left: 5px">{{ label }}</span>
        </div>
      </template>

      <!-- options: local branches -->
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
          <span v-if="op.branch?.remote_track" class="remote">
            {{ op.branch?.remote_track }}
          </span>
          <div class="actions">
            <cl-fa-icon-button
              :icon="['fa', 'trash']"
              size="small"
              type="danger"
              :disabled="modelValue === op.value"
              @click="
                (event: Event) => onDeleteBranch(op.value as string, event)
              "
            />
          </div>
        </div>
      </el-option>

      <!-- options: remote branches -->
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

      <!-- footer actions -->
      <template #footer>
        <ul class="el-select-dropdown__list">
          <li class="el-select-dropdown__item" @click="onPull">
            <div>
              <cl-icon :icon="['fa', 'cloud-download-alt']" />
              <span>
                {{ t('components.git.branches.pull') }}
              </span>
            </div>
          </li>
          <li class="el-select-dropdown__item" @click="onCommit">
            <div>
              <cl-icon :icon="['fa', 'code-commit']" />
              <span>
                {{ t('components.git.branches.commit') }}
              </span>
            </div>
          </li>
          <li class="el-select-dropdown__item" @click="onPush">
            <div>
              <cl-icon :icon="['fa', 'cloud-upload-alt']" />
              <span>
                {{ t('components.git.branches.push') }}
              </span>
            </div>
          </li>
        </ul>
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

<style scoped>
.git-branch-select {
  min-width: 150px;
}
</style>
<style>
.git-branch-select-dropdown {
  .branch-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;

    .icon-wrapper {
      .icon {
        width: 15px;
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

  .el-select-dropdown__header,
  .el-select-dropdown__footer {
    padding: 0;

    .el-select-dropdown__list {
      &:not(:last-child) {
        border-bottom: 1px solid var(--el-border-color);
      }

      .el-select-dropdown__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;

        &:hover {
          background-color: var(--el-fill-color-light);
        }

        .icon {
          width: 15px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
