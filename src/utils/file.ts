import { FILE_ROOT } from '@/constants';
import { translate } from '@/utils/i18n';

const t = translate;

export const getDirectoryOptions = (items: FileNavItem[]): SelectOption[] => {
  return items
    .filter(item => item.is_dir)
    .map(item => {
      return {
        label: item.name,
        value: item.path,
        children: getDirectoryOptions(item.children || []),
      };
    });
};

export const getRootDirectoryOptions = (
  fileNavItems: FileNavItem[]
): SelectOption[] => {
  return [
    {
      label: `~ (${t('components.file.rootDirectory')})`,
      value: FILE_ROOT,
      children: getDirectoryOptions(fileNavItems),
    },
  ];
};
