import { useDetail } from '@/layouts/content';

const useDatabaseDetail = () => {
  return {
    ...useDetail<Database>('database'),
  };
};

export default useDatabaseDetail;
