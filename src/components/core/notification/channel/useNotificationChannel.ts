import { computed, watch } from 'vue';
import { Store } from 'vuex';
import { useRoute } from 'vue-router';
import { translate, getDefaultFormComponentData } from '@/utils';
import useNotificationChannelService from '@/services/notification/useNotificationChannelService';
import useForm from '@/components/ui/form/useForm';
import { useI18n } from 'vue-i18n';

const t = translate;

// form component data
const formComponentData = getDefaultFormComponentData<NotificationChannel>();

const useNotificationChannel = (store: Store<RootStoreState>) => {
  const { notificationChannel: state } = store.state as RootStoreState;

  const { locale } = useI18n();

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

  const allProviders: NotificationChannelProvider[] = [
    {
      type: 'mail',
      name: 'gmail',
      icon: ['svg', 'gmail'],
      smtpServer: 'smtp.gmail.com',
      smtpPort: 587,
      docUrl: () =>
        `https://support.google.com/a/answer/2956491?hl=${locale.value}`,
      locale: 'en',
      disabled: true,
    },
    {
      type: 'mail',
      name: 'outlook',
      icon: ['svg', 'outlook'],
      smtpServer: 'smtp-mail.outlook.com',
      smtpPort: 587,
      docUrl: () => {
        if (locale.value === 'zh') {
          return 'https://support.microsoft.com/zh-cn/office/outlook-com-%E7%9A%84-pop-imap-%E5%92%8C-smtp-%E8%AE%BE%E7%BD%AE-d088b986-291d-42b8-9564-9c414e2aa040';
        } else {
          return 'https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-for-outlook-com-d088b986-291d-42b8-9564-9c414e2aa040';
        }
      },
      locale: 'en',
    },
    {
      type: 'mail',
      name: 'qq',
      icon: ['fab', 'qq'],
      smtpServer: 'smtp.qq.com',
      smtpPort: 587,
      docUrl: 'https://cloud.tencent.com/developer/article/2177098',
      locale: 'zh',
    },
    {
      type: 'mail',
      name: '163',
      icon: ['svg', 'netease'],
      smtpServer: 'smtp.163.com',
      smtpPort: 465,
      docUrl: 'https://www.bilibili.com/read/cv32056718/',
      locale: 'zh',
    },
    {
      type: 'mail',
      name: 'icloud',
      icon: ['fab', 'apple'],
      smtpServer: 'smtp.mail.me.com',
      smtpPort: 587,
      docUrl: () => {
        if (locale.value === 'zh') {
          return 'https://support.apple.com/zh-cn/102525';
        } else {
          return 'https://support.apple.com/en-us/102525';
        }
      },
      locale: 'en',
    },
    {
      type: 'mail',
      name: 'yahoo',
      icon: ['fab', 'yahoo'],
      smtpServer: 'smtp.mail.yahoo.com',
      smtpPort: 587,
      docUrl:
        'https://smartreach.io/blog/masterclass/smtp/yahoo-smtp-settings/',
      locale: 'en',
    },
    {
      type: 'mail',
      name: 'zoho',
      icon: ['svg', 'zoho'],
      smtpServer: 'smtp.zoho.com',
      smtpPort: 587,
      docUrl: 'https://www.zoho.com/mail/help/zoho-smtp.html',
      locale: 'en',
    },
    {
      type: 'mail',
      name: 'aol',
      icon: ['svg', 'aol'],
      smtpServer: 'smtp.aol.com',
      smtpPort: 587,
      docUrl: 'https://smartreach.io/blog/masterclass/smtp/aol-mail-settings/',
      locale: 'en',
    },
    {
      type: 'im',
      name: 'dingtalk',
      icon: ['svg', 'dingtalk'],
      docUrl: 'https://open.dingtalk.com/document/orgapp/custom-robot-access',
      locale: 'zh',
    },
    {
      type: 'im',
      name: 'lark',
      icon: ['svg', 'lark'],
      docUrl: () => {
        if (locale.value === 'zh') {
          return 'https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot';
        } else {
          return 'https://open.larksuite.com/document/client-docs/bot-v3/add-custom-bot';
        }
      },
      locale: 'zh',
    },
    {
      type: 'im',
      name: 'wechat_work',
      icon: ['svg', 'wechat_work'],
      docUrl: 'https://developer.work.weixin.qq.com/document/path/91770',
      locale: 'zh',
    },
    {
      type: 'im',
      name: 'slack',
      icon: ['fab', 'slack'],
      docUrl: 'https://api.slack.com/messaging/webhooks',
      locale: 'en',
    },
    {
      type: 'im',
      name: 'ms_teams',
      icon: ['svg', 'ms_teams'],
      docUrl: () =>
        `https://learn.microsoft.com/${locale.value === 'zh' ? 'zh-cn' : 'en-us'}/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook`,
      locale: 'en',
    },
    {
      type: 'im',
      name: 'telegram',
      icon: ['fab', 'telegram'],
      docUrl: 'https://core.telegram.org/bots/api',
      locale: 'en',
    },
    {
      type: 'im',
      name: 'discord',
      icon: ['fab', 'discord'],
      docUrl: 'https://discord.com/developers/docs/resources/webhook',
      locale: 'en',
    },
  ];

  const providerOptionGroups = computed<SelectOption[]>(() => {
    const map: Record<string, SelectOption[]> = {};
    allProviders
      .sort((a, b) => {
        if (a.disabled !== b.disabled) {
          return a.disabled ? 1 : -1;
        }
        if (a.locale === b.locale) return 0;
        return a.locale === locale.value ? -1 : 1;
      })
      .forEach(p => {
        const op: SelectOption = {
          value: p.name,
          label: t(`views.notification.channels.providers.${p.name}`),
          icon: p.icon,
          disabled: p.disabled,
        };
        if (!map[p.type]) {
          map[p.type] = [];
        }
        map[p.type].push(op);
      });
    return Object.keys(map).map(key => {
      return {
        label: t(`views.notification.channels.types.${key}`),
        children: map[key],
      };
    });
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
    const { name, icon, disabled } = activeProvider.value;
    return {
      value: name,
      label: t(`views.notification.channels.providers.${name}`),
      icon,
      disabled,
    };
  });

  const allProviderNames = computed(() => allProviders.map(p => p.name));

  const getProviderIcon = (provider: string): Icon | undefined => {
    return allProviders.find(p => p.name === provider)?.icon;
  };

  return {
    ...useForm<NotificationChannel>(
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
    allProviders,
    allProviderNames,
    getProviderIcon,
  };
};

export default useNotificationChannel;
