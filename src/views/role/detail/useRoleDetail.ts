import { useDetail } from '@/layouts';

const useRoleDetail = () => {
  return {
    ...useDetail<Role>('role'),
  };
};

export default useRoleDetail;
