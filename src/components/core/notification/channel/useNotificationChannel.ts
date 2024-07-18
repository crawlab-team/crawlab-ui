import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { Store } from 'vuex';
import useForm from '@/components/ui/form/useForm';
import useNotificationChannelService from '@/services/notification/useNotificationChannelService';
import { getDefaultFormComponentData } from '@/utils/form';

// form component data
const formComponentData = getDefaultFormComponentData<NotificationChannel>();

const useNotificationChannel = (store: Store<RootStoreState>) => {
  const { notificationChannel: state } = store.state as RootStoreState;
  // route
  const route = useRoute();

  // notification id
  const id = computed(() => route.params.id);

  const form = computed(() => state.form);

  return {
    ...useForm(
      'notificationChannel',
      store,
      useNotificationChannelService(store),
      formComponentData
    ),
    id,
    form,
  };
};

export default useNotificationChannel;
