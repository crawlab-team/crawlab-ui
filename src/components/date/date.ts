export const getRangeItemOption = (
  label: string,
  key: RangeItemKey,
  value?: RangeItemValue
): RangeItemOption => {
  if (typeof value === 'function') {
    value = value();
  }
  return {
    label,
    value: {
      key,
      value,
    },
  };
};
