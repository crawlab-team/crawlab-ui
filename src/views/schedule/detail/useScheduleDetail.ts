import { useStore } from 'vuex';
import { useDetail } from '@/layouts';
import { setupGetAllList } from '@/utils/list';

const useScheduleDetail = () => {
  // store
  const store = useStore();

  setupGetAllList(store, ['node', 'spider']);

  return {
    ...useDetail<Schedule>('schedule'),
  };
};

export default useScheduleDetail;
