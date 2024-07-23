<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import useNotificationChannel from '@/components/core/notification/channel/useNotificationChannel';

defineProps<{
  readonly?: boolean;
}>();

// i18n
const t = translate;

// store
const ns: ListStoreNamespace = 'notificationChannel';
const store = useStore();

const {
  form,
  formRef,
  isSelectiveForm,
  typeOptions,
  providerOptionGroups,
  activeProvider,
  activeProviderOption,
  allProviderNames,
} = useNotificationChannel(store);

const smtpPasswordVisible = ref(false);

const onTypeChange = () => {
  store.commit(`${ns}/setForm`, {
    ...form.value,
    provider: 'custom',
    smtp_server: '',
    smtp_port: '',
    smtp_username: '',
    smtp_password: '',
    webhook_url: '',
  });
};

const onProviderChange = (val: string) => {
  if (val === 'custom') {
    store.commit(`${ns}/setForm`, {
      ...form.value,
      smtp_server: '',
      smtp_port: '',
      smtp_username: '',
      smtp_password: '',
      webhook_url: '',
    });
    return;
  }
  let payload: Partial<NotificationChannel>;
  if (!activeProvider.value) return;
  const { type, name, smtpServer, smtpPort } = activeProvider.value;
  switch (type) {
    case 'mail':
      payload = {
        type,
        smtp_server: smtpServer,
        smtp_port: smtpPort,
      };
      break;
    case 'im':
      payload = {
        type,
        webhook_url: '',
      };
      break;
  }
  if (
    !form.value.name ||
    allProviderNames.value.some(
      name =>
        t(`views.notification.channels.providers.${name}`) === form.value.name
    )
  ) {
    payload.name = t(`views.notification.channels.providers.${name}`);
  }
  store.commit(`${ns}/setForm`, {
    ...form.value,
    ...payload,
  });
};

const hasProvider = computed(
  () => activeProvider.value && activeProvider.value.name !== 'custom'
);

defineOptions({ name: 'ClNotificationChannelForm' });
</script>

<template>
  <cl-form v-if="form" ref="formRef" :model="form" :selective="isSelectiveForm">
    <cl-form-item
      :span="2"
      :label="t('views.notification.channels.form.name')"
      prop="name"
      required
    >
      <el-input
        v-model="form.name"
        :placeholder="t('views.notification.channels.form.name')"
      />
    </cl-form-item>

    <cl-form-item
      :span="2"
      :label="t('views.notification.channels.form.type')"
      prop="type"
      required
    >
      <el-radio-group v-model="form.type" @change="onTypeChange">
        <el-radio-button
          v-for="op in typeOptions"
          :key="op.value"
          :value="op.value"
        >
          <cl-icon :icon="op.icon" />
          {{ op.label }}
        </el-radio-button>
      </el-radio-group>
    </cl-form-item>

    <cl-form-item
      :span="2"
      :offset="hasProvider ? 0 : 2"
      :label="t('views.notification.channels.form.provider')"
      prop="provider"
      required
    >
      <el-select
        v-model="form.provider"
        filterable
        clearable
        @change="onProviderChange"
      >
        <template #label>
          <span class="icon-wrapper">
            <cl-icon :icon="activeProviderOption.icon" />
          </span>
          {{ activeProviderOption.label }}
        </template>
        <el-option-group
          v-for="group in providerOptionGroups"
          :key="group.value"
          :label="group.label"
        >
          <el-option
            v-for="op in group.children"
            :key="op.value"
            :value="op.value"
            :disabled="op.disabled"
          >
            <span class="icon-wrapper">
              <cl-icon :icon="op.icon" />
            </span>
            {{ op.label }}
          </el-option>
        </el-option-group>
        <el-option-group
          :label="t('views.notification.channels.providers.custom')"
        >
          <el-option value="custom">
            <span class="icon-wrapper">
              <cl-icon :icon="['fa', 'edit']" />
              {{ t('views.notification.channels.providers.custom') }}
            </span>
          </el-option>
        </el-option-group>
      </el-select>
    </cl-form-item>
    <cl-form-item
      v-if="hasProvider"
      :span="2"
      :label="t('views.notification.channels.providerDocs.title')"
    >
      <el-link
        type="primary"
        :href="
          typeof activeProvider?.docUrl === 'function'
            ? activeProvider?.docUrl()
            : activeProvider?.docUrl
        "
        target="_blank"
      >
        <el-space>
          <span>
            {{ t('views.notification.channels.providerDocs.label') }}
          </span>
          <span>-</span>
          <span>
            {{
              t(`views.notification.channels.providers.${activeProvider?.name}`)
            }}
          </span>
          <span>
            <cl-icon :icon="['fa', 'external-link-alt']" />
          </span>
        </el-space>
      </el-link>
    </cl-form-item>

    <template v-if="form.type === 'mail'">
      <cl-form-item
        :span="2"
        :label="t('views.notification.channels.form.smtpServer')"
        prop="smtp_port"
        required
      >
        <el-input
          v-model="form.smtp_server"
          :placeholder="t('views.notification.channels.form.smtpServer')"
        />
      </cl-form-item>
      <cl-form-item
        :span="2"
        :label="t('views.notification.channels.form.smtpPort')"
        prop="smtp_port"
        required
      >
        <el-input
          v-model="form.smtp_port"
          type="number"
          :placeholder="t('views.notification.channels.form.smtpPort')"
        />
      </cl-form-item>
      <cl-form-item
        :span="2"
        :label="t('views.notification.channels.form.smtpUsername')"
        prop="smtp_username"
        required
      >
        <el-input
          v-model="form.smtp_username"
          :placeholder="t('views.notification.channels.form.smtpUsername')"
        />
      </cl-form-item>
      <cl-form-item
        :span="2"
        :label="t('views.notification.channels.form.smtpPassword')"
        prop="smtp_password"
        required
      >
        <el-input
          v-model="form.smtp_password"
          :type="smtpPasswordVisible ? 'text' : 'password'"
          :placeholder="t('views.notification.channels.form.smtpPassword')"
        >
          <template #suffix>
            <span
              style="cursor: pointer"
              @click="smtpPasswordVisible = !smtpPasswordVisible"
            >
              <cl-icon v-if="!smtpPasswordVisible" :icon="['fa', 'eye']" />
              <cl-icon v-else :icon="['fa', 'eye-slash']" />
            </span>
          </template>
        </el-input>
      </cl-form-item>
    </template>
    <template v-else-if="form.type === 'im'">
      <cl-form-item
        :span="4"
        :label="t('views.notification.channels.form.webhookUrl')"
        prop="webhook_url"
        required
      >
        <el-input
          v-model="form.webhook_url"
          :placeholder="t('views.notification.channels.form.webhookUrl')"
        />
      </cl-form-item>
    </template>

    <cl-form-item
      :span="4"
      :label="t('views.notification.channels.form.description')"
      prop="description"
    >
      <el-input
        v-model="form.description"
        type="textarea"
        :placeholder="t('views.notification.channels.form.description')"
      />
    </cl-form-item>
  </cl-form>
</template>

<style scoped>
.icon-wrapper {
  display: inline-block;
  text-align: center;
  width: 18px;
  margin-right: 2px;

  &:deep(img) {
    filter: grayscale(100);
  }
}

.el-alert {
  padding: 0 10px;

  &:deep(.el-icon) {
    width: 18px;
  }

  &:deep(.el-link) {
    margin-left: 5px;
  }
}
</style>
