<script setup lang="ts">
import { useStore } from 'vuex';
import useNotificationChannel from '@/components/core/notification/channel/useNotificationChannel';
import { translate } from '@/utils';
import { computed, ref, watch } from 'vue';
import ClFormItem from '@/components/ui/form/FormItem.vue';

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
} = useNotificationChannel(store);

const smtpPasswordVisible = ref(false);

watch(
  () => form.value.provider,
  val => {
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
    switch (activeProvider.value?.type) {
      case 'mail':
        store.commit(`${ns}/setForm`, {
          ...form.value,
          type: 'mail',
          smtp_server: activeProvider.value.smtpServer,
          smtp_port: activeProvider.value.smtpPort,
        });
        break;
      case 'im':
        store.commit(`${ns}/setForm`, {
          ...form.value,
          type: 'im',
          webhook_url: '',
        });
        break;
    }
  }
);

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
      <el-radio-group v-model="form.type">
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
      :span="4"
      :label="t('views.notification.channels.form.provider')"
      prop="provider"
      required
    >
      <el-select v-model="form.provider" filterable clearable>
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
    <cl-form-item v-if="hasProvider" :span="2">
      <el-link type="primary" :href="activeProvider?.docUrl" target="_blank">
        {{ t('views.notification.channels.providerDoc.label') }}
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
</style>
