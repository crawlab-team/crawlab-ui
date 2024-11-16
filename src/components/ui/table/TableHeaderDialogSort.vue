<script setup lang="ts">
import { ASCENDING, DESCENDING, UNSORTED } from '@/constants/sort';
import { translate } from '@/utils';

defineProps<{
  value?: string;
}>();

const emit = defineEmits<{
  (e: 'change', value?: string): void;
}>();

// i18n
const t = translate;

const onChange = (value: SortDirection) => {
  if (value === UNSORTED) {
    emit('change', undefined);
    return;
  }
  emit('change', value);
};

const onClear = () => {
  emit('change');
};
defineOptions({ name: 'ClTableHeaderDialogSort' });
</script>

<template>
  <div class="table-header-dialog-sort">
    <div class="title">
      <span>{{ t('components.table.header.dialog.sort.title') }}</span>
      <el-tooltip
        v-if="value"
        :content="t('components.table.header.dialog.sort.clearSort')"
      >
        <span class="icon" @click="onClear">
          <el-icon name="circle-close" />
        </span>
      </el-tooltip>
    </div>
    <el-radio-group :model-value="value" type="primary" @change="onChange">
      <el-radio-button :value="ASCENDING" class="sort-btn">
        <cl-icon :icon="['fa', 'sort-amount-up']" />
        {{ t('components.table.header.dialog.sort.ascending') }}
      </el-radio-button>
      <el-radio-button :value="DESCENDING" class="sort-btn">
        <cl-icon :icon="['fa', 'sort-amount-down-alt']" />
        {{ t('components.table.header.dialog.sort.descending') }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<style scoped>
.table-header-dialog-sort {
  .title {
    font-size: 14px;
    font-weight: 900;
    margin-bottom: 10px;
    color: var(--cl-info-medium-color);
    display: flex;
    align-items: center;

    .icon {
      cursor: pointer;
      margin-left: 5px;
    }
  }

  .el-radio-group {
    width: 100%;
    display: flex;

    .sort-btn.el-radio-button {
      &:not(.unsorted) {
        flex: 1;
      }

      &.unsorted {
        flex-basis: 20px;
      }
    }
  }
}
</style>
<style scoped>
.table-header-dialog-sort:deep(
    .el-radio-group .el-radio-button .el-radio-button__inner
  ) {
  width: 100%;
}
</style>
