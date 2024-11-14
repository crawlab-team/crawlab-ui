import { Store } from 'vuex';
import useForm from '@/components/ui/form/useForm';
import useGitService from '@/services/git/gitService';
import { getDefaultFormComponentData } from '@/utils/form';

// form component data
const formComponentData = getDefaultFormComponentData<Git>();

const getGitIcon = (row: Git): { icon: Icon; color?: string; name: string } => {
  if (row.url?.includes('github')) {
    return { icon: ['fab', 'github'], color: '#0d1117', name: 'github' };
  } else if (row.url?.includes('bitbucket')) {
    return { icon: ['fab', 'bitbucket'], color: '#0052cc', name: 'bitbucket' };
  } else if (row.url?.includes('gitlab')) {
    return { icon: ['fab', 'gitlab'], color: '#E24329', name: 'gitlab' };
  } else if (row.url?.includes('amazonaws')) {
    return { icon: ['fab', 'aws'], color: '#232f3e', name: 'aws' };
  } else {
    return {
      icon: ['fab', 'git'],
      color: 'var(--cl-info-medium-dark-color)',
      name: 'git',
    };
  }
};

const useGit = (store: Store<RootStoreState>) => {
  return {
    ...useForm<Git>('git', store, useGitService(store), formComponentData),
    getGitIcon,
  };
};

export default useGit;
