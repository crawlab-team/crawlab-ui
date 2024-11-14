import { computed, readonly } from 'vue';
import { Store } from 'vuex';
import { isDuplicated } from '@/utils/array';
import useForm from '@/components/ui/form/useForm';
import useProjectService from '@/services/project/projectService';
import { getDefaultFormComponentData } from '@/utils/form';
import {
  FORM_FIELD_TYPE_INPUT,
  FORM_FIELD_TYPE_INPUT_TEXTAREA,
} from '@/constants/form';
import { translate } from '@/utils/i18n';

// form component data
const formComponentData = getDefaultFormComponentData<Project>();

const useProject = (store: Store<RootStoreState>) => {
  // store
  const ns = 'project';
  const state = store.state[ns];

  // form rules
  const formRules: FormRules = {};

  // all project select options
  const allProjectSelectOptions = computed<SelectOption[]>(() =>
    state.allList.map(d => {
      return {
        label: d.name,
        value: d._id,
      };
    })
  );

  return {
    ...useForm<Project>(
      'project',
      store,
      useProjectService(store),
      formComponentData
    ),
    formRules,
    allProjectSelectOptions,
  };
};

export default useProject;
