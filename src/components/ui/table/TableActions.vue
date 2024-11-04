<script setup lang="ts">
import { inject } from 'vue';
import { ACTION_DELETE, ACTION_EDIT } from '@/constants/action';
import {
  TABLE_ACTION_CUSTOMIZE_COLUMNS,
  TABLE_ACTION_EXPORT,
} from '@/constants/table';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { emptyArrayFunc, getPrimaryPath, translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    selection: TableData;
    visibleButtons: BuiltInTableActionButtonName[];
    hide?: boolean;
  }>(),
  {
    selection: emptyArrayFunc,
    visibleButtons: emptyArrayFunc,
  }
);

const emit = defineEmits<{
  (e: 'edit'): void;
  (e: 'delete'): void;
  (e: 'export'): void;
  (e: 'customize-columns'): void;
}>();

// i18n
const t = translate;

// store
const store = useStore();

// route
const route = useRoute();

// const onAdd = () => {
//   emit('click-add');
// };

const onEdit = () => {
  emit('edit');
};

const onDelete = async () => {
  emit('delete');
};

const onExport = () => {
  emit('export');
};

const onCustomizeColumns = () => {
  emit('customize-columns');
};

const showButton = (name: string): boolean => {
  if (props.hide) return false;
  const { visibleButtons } = props;
  if (
    visibleButtons &&
    visibleButtons.length > 0 &&
    !visibleButtons.includes(name)
  ) {
    return false;
  }
  const currentRoutePath = route.path;
  const { actionVisibleFn } = (store.state as RootStoreState).layout;
  if (!actionVisibleFn) return true;
  return actionVisibleFn(currentRoutePath, name);
};

// export target
const target = () => {
  const primaryPath = getPrimaryPath(route.path);
  return primaryPath.replace(/^\//, '');
};

// store context
const storeContext = inject<ListStoreContext<BaseModel>>('store-context');

// export conditions
const conditions = () => {
  const state = storeContext?.state as BaseStoreState;
  return state?.tableListFilter || [];
};
defineOptions({ name: 'ClTableActions' });
</script>

<template>
  <div class="table-actions">
    <slot name="prefix"></slot>
    <cl-fa-icon-button
      v-if="false && showButton(ACTION_EDIT)"
      :disabled="selection.length === 0"
      :icon="['fa', 'edit']"
      id="edit-btn"
      class="action-btn edit-btn"
      size="small"
      :tooltip="t('components.table.actions.editSelected')"
      type="warning"
      @click="onEdit"
    />
    <cl-fa-icon-button
      v-if="showButton(ACTION_DELETE)"
      :disabled="selection.length === 0"
      :icon="['fa', 'trash-alt']"
      id="delete-btn"
      class="action-btn delete-btn"
      size="small"
      :tooltip="t('components.table.actions.deleteSelected')"
      type="danger"
      @click="onDelete"
    />
    <div
      v-if="false"
      v-export="{
        target,
        conditions,
      }"
    >
      <cl-fa-icon-button
        v-if="showButton(TABLE_ACTION_EXPORT)"
        :icon="['fa', 'file-export']"
        id="export-btn"
        class="action-btn export-btn"
        size="small"
        :tooltip="`${t('components.table.actions.export')}`"
        type="primary"
        @click="onExport"
      />
    </div>
    <cl-fa-icon-button
      v-if="false && showButton(TABLE_ACTION_CUSTOMIZE_COLUMNS)"
      :icon="['fa', 'arrows-alt']"
      id="customize-columns-btn"
      class="action-btn customize-columns-btn"
      size="small"
      :tooltip="t('components.table.actions.customizeColumns')"
      type="primary"
      @click="onCustomizeColumns"
    />
    <slot name="suffix"></slot>
  </div>
</template>

<style scoped>
.table-actions {
  display: inline-flex;
  align-items: center;
  gap: 5px;

  .nav-action-button {
    display: inline-flex;
  }
}
</style>
