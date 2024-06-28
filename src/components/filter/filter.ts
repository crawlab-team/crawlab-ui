import { plainClone } from '@/utils';
import {
  FILTER_OP_CONTAINS,
  FILTER_OP_EQUAL,
  FILTER_OP_GREATER_THAN,
  FILTER_OP_GREATER_THAN_EQUAL,
  FILTER_OP_LESS_THAN,
  FILTER_OP_LESS_THAN_EQUAL,
  FILTER_OP_NOT_CONTAINS,
  FILTER_OP_NOT_EQUAL,
  FILTER_OP_NOT_SET,
  FILTER_OP_REGEX,
} from '@/constants';

export const defaultFilterCondition: FilterConditionData = {
  op: FILTER_OP_NOT_SET,
  value: '',
};

export const getDefaultFilterCondition = () => {
  return plainClone(defaultFilterCondition);
};

export const conditionTypesOptions: SelectOption[] = [
  { value: FILTER_OP_NOT_SET, label: 'Not Set' },
  { value: FILTER_OP_CONTAINS, label: 'Contains' },
  { value: FILTER_OP_NOT_CONTAINS, label: 'Not Contains' },
  { value: FILTER_OP_REGEX, label: 'Regex' },
  { value: FILTER_OP_EQUAL, label: 'Equal to' },
  { value: FILTER_OP_NOT_EQUAL, label: 'Not Equal to' },
  { value: FILTER_OP_GREATER_THAN, label: 'Greater than' },
  { value: FILTER_OP_LESS_THAN, label: 'Less than' },
  { value: FILTER_OP_GREATER_THAN_EQUAL, label: 'Greater than or Equal to' },
  { value: FILTER_OP_LESS_THAN_EQUAL, label: 'Less than or Equal to' },
];

export const conditionTypesMap: { [key: string]: string } = (() => {
  const map: { [key: string]: string } = {};
  conditionTypesOptions.forEach(d => {
    map[d.value] = d.label as string;
  });
  return map;
})();
