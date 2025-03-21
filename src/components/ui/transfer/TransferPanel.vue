<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    title: string;
    checked?: string[];
    data?: DraggableItemData[];
  }>(),
  {
    title: 'Title',
  }
);

const emit = defineEmits<{
  (e: 'check', value: string[]): void;
  (e: 'drag', items: DraggableItemData[]): void;
}>();

const t = translate;

const searchString = ref<string>('');

const isCheckedAll = ref<boolean>(false);

const isIntermediate = ref<boolean>(false);

const items = computed<DraggableItemData[]>(() => {
  const { data } = props as TransferPanelProps;
  if (!searchString.value) {
    return data;
  }
  return data?.filter(d =>
    d.label.toLowerCase().includes(searchString.value.toLowerCase())
  );
});

const summary = computed<string>(() => {
  const { checked, data } = props as TransferPanelProps;
  return `${checked.length}/${data.length}`;
});

const onCheck = (value: string[]) => {
  emit('check', value);
};

const onCheckAll = (value: boolean) => {
  const { data } = props as TransferPanelProps;
  emit('check', value ? data?.map(d => d.key) : []);
};

const onDragEnd = (items: DraggableItemData[]) => {
  emit('drag', items);
};

watch(
  () => {
    const { checked } = props as TransferPanelProps;
    return checked;
  },
  () => {
    const { checked, data } = props as TransferPanelProps;
    isCheckedAll.value =
      checked?.length > 0 && checked?.length === data?.length;
    isIntermediate.value =
      checked?.length > 0 && checked?.length < data?.length;
  }
);
defineOptions({ name: 'ClTransferPanel' });
</script>

<template>
  <el-card class="transfer-panel" shadow="never">
    <template #header>
      <div class="transfer-panel-header">
        <div class="left">
          <el-checkbox
            v-model="isCheckedAll"
            :disabled="data?.length === 0"
            :indeterminate="isIntermediate"
            class="check-all"
            @change="onCheckAll"
          />
          <span class="title">{{ title }}</span>
        </div>
        <div class="summary">
          {{ summary }}
        </div>
      </div>
    </template>
    <template #default>
      <div class="transfer-panel-body">
        <el-input
          v-model="searchString"
          class="search"
          :placeholder="t('common.actions.search')"
          :prefix-icon="Search"
        />
        <template v-if="items.length > 0">
          <el-checkbox-group
            :model-value="checked"
            class="check-list"
            @change="onCheck"
          >
            <cl-draggable-list :items="items" @d-end="onDragEnd">
              <template #default="{ item }">
                <el-checkbox
                  :label="item.key"
                  class="check-item"
                  :disabled="item.disabled"
                >
                  {{ item.label }}
                </el-checkbox>
              </template>
            </cl-draggable-list>
          </el-checkbox-group>
        </template>
        <template v-else>
          <div class="empty-wrapper">
            <cl-empty class="empty" />
          </div>
        </template>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.transfer-panel {
  flex: 1;
  min-width: 240px;
  padding: 0 10px;

  .transfer-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      align-items: center;

      .title {
        padding-left: 10px;
        font-size: 16px;
      }
    }
  }

  .transfer-panel-body {
    .search {
      margin-bottom: 10px;
    }

    .check-list {
      height: 360px;
      overflow: auto;
      display: flex;
      flex-direction: column;

      .check-item {
        padding: 5px;
      }
    }

    .empty-wrapper {
      height: 360px;
    }
  }

  &:deep(.draggable-list) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
