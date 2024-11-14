import { useDetail } from '@/layouts';

const useUserDetail = () => {
  return {
    ...useDetail<User>('user'),
  };
};

export default useUserDetail;
