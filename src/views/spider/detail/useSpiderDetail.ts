import { useStore } from 'vuex';
import { useDetail } from '@/layouts';
import { setupGetAllList } from '@/utils';
import useFileService from '@/services/utils/file';

const useSpiderDetail = () => {
  const ns: ListStoreNamespace = 'spider';
  const store = useStore();

  setupGetAllList(store, ['node', 'project']);

  return {
    ...useDetail<Spider>('spider'),
    ...useFileService(ns, store),
  };
};

export default useSpiderDetail;
