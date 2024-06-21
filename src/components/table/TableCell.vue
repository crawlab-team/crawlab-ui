<script setup lang="ts">
defineOptions({ name: 'ClTableCell' });
import { h } from 'vue';
import FaIconButton from '@/components/button/FaIconButton.vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const props = withDefaults(
  defineProps<{
    column: TableColumn;
    row: TableData;
    rowIndex: number;
  }>(),
  {
    rowIndex: 0,
  }
);

// route
const route = useRoute();

// store
const store = useStore();

const getChildren = () => {
  const { row, column, rowIndex } = props;
  const { value, buttons } = column;

  // buttons
  if (buttons) {
    // normalize
    let _buttons: TableColumnButton[] = [];
    if (typeof buttons === 'function') {
      _buttons = buttons(row);
    } else if (Array.isArray(buttons) && buttons.length > 0) {
      _buttons = buttons;
    }

    // current route path
    const currentRoutePath = route.path;

    // action visible function
    const actionVisibleFn = (store.state as RootStoreState).layout
      .actionVisibleFn;

    return _buttons
      .filter(btn => {
        if (!actionVisibleFn) return true;
        if (!currentRoutePath) return true;

        // skip if action is not allowed
        return actionVisibleFn(currentRoutePath, btn.action);
      })
      .map(btn => {
        const { tooltip, type, size, icon, disabled, onClick, id, className } =
          btn;
        const props = {
          key: JSON.stringify({ tooltip, type, size, icon }),
          tooltip: typeof tooltip === 'function' ? tooltip(row) : tooltip,
          type,
          size: size || 'small',
          icon,
          disabled: disabled?.(row),
          onClick: () => {
            onClick?.(row, rowIndex, column);
          },
          id,
          className,
        };
        // FIXME: use "as any" to fix type errors temporarily
        return h(FaIconButton, props as any);
      });
  }

  // normalized value
  let normalizedValue = value || row[column.key as any];
  switch (typeof normalizedValue) {
    case 'undefined':
      return '';
    case 'function':
      return [normalizedValue(row, rowIndex, column)];
    case 'object':
      return JSON.stringify(normalizedValue);
    default:
      return normalizedValue;
  }
};

const root = h('div', getChildren());
</script>

<template>
  <root />
</template>

<style lang="scss" scoped></style>
