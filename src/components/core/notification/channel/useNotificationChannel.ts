import { computed } from 'vue';
import { Store } from 'vuex';
import { useRoute } from 'vue-router';
import { translate, getDefaultFormComponentData } from '@/utils';
import useNotificationChannelService from '@/services/notification/useNotificationChannelService';
import useForm from '@/components/ui/form/useForm';

const t = translate;

// form component data
const formComponentData = getDefaultFormComponentData<NotificationChannel>();

const allProviders: NotificationChannelProvider[] = [
  {
    type: 'mail',
    name: 'gmail',
    icon: ['fab', 'google'],
  },
  {
    type: 'mail',
    name: 'outlook',
    icon: ['fab', 'microsoft'],
  },
  {
    type: 'mail',
    name: 'qq',
    icon: ['fab', 'qq'],
  },
  {
    type: 'mail',
    name: '163',
    icon: ['svg', '163'],
  },
  {
    type: 'mail',
    name: 'icloud',
    icon: ['fab', 'apple'],
  },
  {
    type: 'mail',
    name: 'yahoo',
    icon: ['fab', 'yahoo'],
  },
  {
    type: 'mail',
    name: 'hotmail',
    icon: ['fab', 'microsoft'],
  },
  {
    type: 'mail',
    name: 'aol',
    icon: ['fab', 'aol'],
  },
  {
    type: 'mail',
    name: 'zoho',
    icon: ['fab', 'zoho'],
  },
  {
    type: 'mail',
    name: 'yandex',
    icon: ['fab', 'yandex'],
  },
  {
    type: 'mail',
    name: '126',
    icon: ['fab', 'qq'],
  },
  {
    type: 'mail',
    name: 'sina',
    icon: ['fab', 'sina'],
  },
  {
    type: 'mail',
    name: 'sohu',
    icon: ['fab', 'sohu'],
  },
  {
    type: 'mail',
    name: 'exmail',
    icon: ['fab', 'qq'],
  },
  {
    type: 'im',
    name: 'wechat_work',
    icon: ['fab', 'weixin'],
  },
  {
    type: 'im',
    name: 'dingtalk',
    icon: ['fab', 'dingtalk'],
  },
  {
    type: 'im',
    name: 'lark',
    icon: ['fab', 'lark'],
  },
  {
    type: 'im',
    name: 'slack',
    icon: ['fab', 'slack'],
  },
  {
    type: 'im',
    name: 'ms_teams',
    icon: ['fab', 'microsoft'],
  },
  {
    type: 'im',
    name: 'telegram',
    icon: ['fab', 'telegram'],
  },
  {
    type: 'im',
    name: 'discord',
    icon: ['fab', 'discord'],
  },
  {
    type: 'im',
    name: 'whatsapp_business',
    icon: ['fab', 'whatsapp'],
  },
  {
    type: 'im',
    name: 'facebook_messenger',
    icon: ['fab', 'facebook'],
  },
];

const useNotificationChannel = (store: Store<RootStoreState>) => {
  const { notificationChannel: state } = store.state as RootStoreState;
  // route
  const route = useRoute();

  // notification id
  const id = computed(() => route.params.id);

  const form = computed(() => state.form);

  const typeOptions = computed<SelectOption[]>(() => [
    {
      value: 'mail',
      label: t('views.notification.channels.types.mail'),
      icon: ['fa', 'at'],
    },
    {
      value: 'im',
      label: t('views.notification.channels.types.im'),
      icon: ['far', 'comment'],
    },
  ]);

  const providerOptionGroups = computed<SelectOption[]>(() => {
    const map: Record<string, SelectOption[]> = {};
    allProviders.forEach(p => {
      const op = {
        value: p.name,
        label: t(`views.notification.channels.providers.${p.name}`),
        icon: p.icon,
      };
      if (!map[p.type]) {
        map[p.type] = [];
      }
      map[p.type].push(op);
    });
    return Object.keys(map).map(key => ({
      label: t(`views.notification.channels.types.${key}`),
      children: map[key],
    }));
  });

  const activeProviderOption = computed<SelectOption>(() => {
    const provider = allProviders.find(p => p.name === form.value.provider);
    if (!provider) {
      return {
        value: '',
        label: '',
        icon: [],
      };
    }
    return {
      value: provider.name,
      label: provider.name,
      icon: provider.icon,
    };
  });

  return {
    ...useForm(
      'notificationChannel',
      store,
      useNotificationChannelService(store),
      formComponentData
    ),
    id,
    form,
    typeOptions,
    providerOptionGroups,
    activeProviderOption,
  };
};

export default useNotificationChannel;
