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
    icon: ['svg', 'gmail'],
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
  },
  {
    type: 'mail',
    name: 'outlook',
    icon: ['svg', 'outlook'],
    smtpServer: 'smtp.office365.com',
    smtpPort: 587,
  },
  {
    type: 'mail',
    name: 'qq',
    icon: ['fab', 'qq'],
    smtpServer: 'smtp.qq.com',
    smtpPort: 587,
  },
  {
    type: 'mail',
    name: '163',
    icon: ['svg', 'netease'],
    smtpServer: 'smtp.163.com',
    smtpPort: 465,
  },
  {
    type: 'mail',
    name: 'icloud',
    icon: ['fab', 'apple'],
    smtpServer: 'smtp.mail.me.com',
    smtpPort: 587,
  },
  {
    type: 'mail',
    name: 'yahoo',
    icon: ['fab', 'yahoo'],
    smtpServer: 'smtp.mail.yahoo.com',
    smtpPort: 587,
  },
  {
    type: 'mail',
    name: 'zoho',
    icon: ['svg', 'zoho'],
    smtpServer: 'smtp.zoho.com',
    smtpPort: 587,
  },
  {
    type: 'mail',
    name: 'aol',
    icon: ['svg', 'aol'],
    smtpServer: 'smtp.aol.com',
    smtpPort: 587,
  },
  {
    type: 'mail',
    name: 'exmail',
    icon: ['fab', 'weixin'],
    smtpServer: 'smtp.exmail.qq.com',
    smtpPort: 465,
  },
  {
    type: 'im',
    name: 'dingtalk',
    icon: ['svg', 'dingtalk'],
  },
  {
    type: 'im',
    name: 'lark',
    icon: ['svg', 'lark'],
  },
  {
    type: 'im',
    name: 'wechat_work',
    icon: ['svg', 'wechat_work'],
  },
  {
    type: 'im',
    name: 'slack',
    icon: ['fab', 'slack'],
  },
  {
    type: 'im',
    name: 'ms_teams',
    icon: ['svg', 'ms_teams'],
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

  const activeProvider = computed<NotificationChannelProvider | null>(() => {
    const provider = allProviders.find(p => p.name === form.value.provider);
    if (!provider) {
      return null;
    }
    return provider;
  });

  const activeProviderOption = computed<SelectOption>(() => {
    if (form.value.provider === 'custom') {
      return {
        value: form.value.provider,
        label: t('views.notification.channels.providers.custom'),
        icon: ['fa', 'edit'],
      };
    }
    if (!activeProvider.value) {
      return {
        value: '',
        label: '',
        icon: [],
      };
    }
    const { name, icon } = activeProvider.value;
    return {
      value: name,
      label: t(`views.notification.channels.providers.${name}`),
      icon,
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
    activeProvider,
    activeProviderOption,
  };
};

export default useNotificationChannel;
