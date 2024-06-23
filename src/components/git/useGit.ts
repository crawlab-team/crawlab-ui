import { Store } from 'vuex';
import useForm from '@/components/form/useForm';
import useGitService from '@/services/git/gitService';
import { getDefaultFormComponentData } from '@/utils/form';

// form component data
const formComponentData = getDefaultFormComponentData<Git>();

const useGit = (store: Store<RootStoreState>) => {
  return {
    ...useForm('git', store, useGitService(store), formComponentData),
  };
};

export default useGit;
