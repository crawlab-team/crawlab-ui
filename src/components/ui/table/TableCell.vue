<script setup lang="tsx">
import { computed, h } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ClButtonGroup, ClFaIconButton } from '@/components';
import { getIconByAction } from '@/utils';
import type { FaIconButtonProps } from '@/components/ui/button/types';
import type { ContextMenuItem } from '@/components/ui/context-menu/types';

const props = withDefaults(
  defineProps<{
    column: TableColumn;
    row: Record<any, any>;
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

const rootComponent = () => {
  const { row, column, rowIndex } = props;
  const { value, buttons, buttonsType, buttonGroupType, buttonGroupSize } =
    column;

  // buttons
  if (buttons) {
    switch (buttonsType) {
      case 'button':
        return getButtons(buttons);
      default:
        return getButtonsGroup(buttons, buttonGroupType, buttonGroupSize);
    }
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

const getNormalizedButtons = (
  buttons: TableColumnButtons,
  contextMenu?: boolean
) => {
  const { column, row, rowIndex } = props;

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

      if (contextMenu !== undefined) {
        return !!btn.contextMenu === contextMenu;
      }

      // skip if action is not allowed
      return actionVisibleFn(currentRoutePath, btn.action);
    })
    .map(btn => {
      const { tooltip, type, icon, disabled, onClick, id, className, loading } =
        btn;
      let _icon: Icon | undefined;
      if (typeof icon === 'function') {
        _icon = icon(row, rowIndex, column);
      } else if (typeof icon === 'undefined') {
        _icon = getIconByAction(btn.action);
      } else {
        _icon = icon;
      }
      const _loading = loading?.(row);
      let _className = className || `${btn.action}-btn`;
      return {
        key: JSON.stringify([row, _loading]),
        buttonType: 'fa-icon',
        id,
        type,
        tooltip: typeof tooltip === 'function' ? tooltip(row) : tooltip,
        disabled: _loading || disabled?.(row),
        icon: _loading ? ['fa', 'spinner'] : _icon,
        spin: _loading,
        className: _className,
        onClick: () => {
          if (loading?.(row)) return;
          onClick?.(row, rowIndex, column);
        },
      } as FaIconButtonProps;
    });
};

const getButtonGroupDropdownItems = (
  buttons: TableColumnButtons
): ContextMenuItem[] => {
  // skip if no context menu buttons
  const contextMenuButtons = getNormalizedButtons(buttons, true);
  if (contextMenuButtons.length === 0) return [];

  // get all buttons
  const allButtons = getNormalizedButtons(buttons);
  return allButtons.map(btn => {
    return {
      title: btn.tooltip,
      icon: btn.icon,
      className: btn.className,
      action: btn.onClick,
      disabled: btn.disabled,
    } as ContextMenuItem;
  });
};

const getButtons = (buttons: TableColumnButtons) => {
  return getNormalizedButtons(buttons).map(props => {
    return <ClFaIconButton {...props} />;
  });
};

const getButtonsGroup = (
  buttons: TableColumnButtons,
  buttonGroupType?: BasicType,
  buttonGroupSize?: BasicSize
) => {
  return (
    <ClButtonGroup
      type={buttonGroupType}
      size={buttonGroupSize}
      buttons={getNormalizedButtons(buttons, false)}
      dropdownItems={getButtonGroupDropdownItems(buttons)}
    />
  );
};

const componentKey = computed(() => {
  const { row, column } = props;
  return row[column.key!];
});

defineOptions({ name: 'ClTableCell' });
</script>

<template>
  <root-component :key="componentKey" />
</template>
