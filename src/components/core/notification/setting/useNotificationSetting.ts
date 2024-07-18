import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { Store } from 'vuex';
import useForm from '@/components/ui/form/useForm';
import useNotificationSettingService from '@/services/notification/useNotificationSettingService';
import { getDefaultFormComponentData } from '@/utils/form';

// form component data
const formComponentData = getDefaultFormComponentData<NotificationSetting>();

const useNotificationSetting = (store: Store<RootStoreState>) => {
  const { notificationSetting: state } = store.state as RootStoreState;
  // route
  const route = useRoute();

  // notification id
  const id = computed(() => route.params.id);

  const form = computed(() => state.form);

  return {
    ...useForm(
      'notificationSetting',
      store,
      useNotificationSettingService(store),
      formComponentData
    ),
    id,
    form,
  };
};

export default useNotificationSetting;
