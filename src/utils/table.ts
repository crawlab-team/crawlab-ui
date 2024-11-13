export const getTableWidth = (el?: Element): number | undefined => {
  const elTable = el || document.querySelector('.table');
  if (!elTable) return;
  const style = getComputedStyle(elTable);
  const widthStr = style.width.replace('px', '');
  const width = Number(widthStr);
  if (isNaN(width)) return;
  return width;
};

export const getColumnWidth = (column: TableColumn): number | undefined => {
  let width: number;
  if (typeof column.width === 'string') {
    width = Number(column.width.replace('px', ''));
    if (isNaN(width)) return;
    return width;
  }
  {
    return column.width;
  }
};

export const getPlaceholderColumn = (): TableColumn => {
  return {
    key: 'placeholder',
    width: 'auto',
    label: '',
  };
};
