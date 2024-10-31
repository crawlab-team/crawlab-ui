<script setup lang="tsx">
import { h } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ClButtonGroup, ClFaIconButton } from '@/components';

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
      const { tooltip, type, size, icon, disabled, onClick, id, className } =
        btn;
      const _icon =
        typeof icon === 'function' ? icon(row, rowIndex, column) : icon;
      return {
        buttonType: 'fa-icon',
        key: JSON.stringify({ tooltip, type, size, icon: _icon }),
        tooltip: typeof tooltip === 'function' ? tooltip(row) : tooltip,
        type,
        icon: _icon,
        disabled: disabled?.(row),
        onClick: () => {
          onClick?.(row, rowIndex, column);
        },
        id,
        className,
      };
    });
};

const getButtonGroupDropdownItems = (
  buttons: TableColumnButtons
): ContextMenuItem[] => {
  return getNormalizedButtons(buttons, true).map(btn => {
    return {
      title: btn.tooltip,
      icon: btn.icon,
      action: btn.onClick,
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

const root = <div>{getChildren()}</div>;

defineOptions({ name: 'ClTableCell' });
</script>

<template>
  <root />
</template>
