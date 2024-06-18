import { useDetail } from '@/layouts/content';

const useDataSourceDetail = () => {
  return {
    ...useDetail('ds'),
  };
};

export default useDataSourceDetail;
