<script setup lang="ts">
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { translate } from '@/utils';
import { useNotificationChannel, useNotificationSetting } from '@/components';
import { ref, watch } from 'vue';
import { useNotificationSettingDetail } from '@/views';

const t = translate;

const ns: ListStoreNamespace = 'notificationSetting';
const store = useStore();

const router = useRouter();

const { form } = useNotificationSetting(store);

const { activeId } = useNotificationSettingDetail();

const { allListSelectOptions } = useNotificationChannel(store);

const selectAll = ref(false);
const selectIntermediate = ref(false);
const updateSelectAll = () => {
  if (!allListSelectOptions.value) return;

  // check if all options are selected
  selectAll.value = allListSelectOptions.value.every(option =>
    form.value.channel_ids?.includes(option.value)
  );

  // check if some options are selected
  if (!selectAll.value) {
    selectIntermediate.value = allListSelectOptions.value.some(option =>
      form.value.channel_ids?.includes(option.value)
    );
  } else {
    selectIntermediate.value = false;
  }
};
watch(() => form.value.channel_ids, updateSelectAll);
watch(activeId, updateSelectAll);
const onSelectAll = () => {
  if (selectAll.value) {
    form.value.channel_ids = allListSelectOptions.value.map(
      option => option.value
    );
  } else {
    form.value.channel_ids = [];
  }
  selectIntermediate.value = false;
};

const onChannelNavigate = async (channelId: string) => {
  await router.push(`/notifications/channels/${channelId}`);
};

defineOptions({ name: 'ClNotificationSettingDetailTabChannels' });
</script>

<template>
  <div class="notification-setting-detail-tab-channels">
    <cl-form>
      <cl-form-item :span="4" :label="t('common.actions.selectAll')">
        <el-checkbox
          v-model="selectAll"
          :indeterminate="selectIntermediate"
          @change="onSelectAll"
        />
      </cl-form-item>
      <cl-form-item
        :span="4"
        :label="t('components.notification.channel.label')"
      >
        <el-checkbox-group v-model="form.channel_ids">
          <el-space spacer="10px">
            <div
              v-for="option in allListSelectOptions"
              :key="option.value"
              style="display: flex; align-items: center"
            >
              <el-checkbox :label="option.value" :value="option.value">
                {{ option.label }}
              </el-checkbox>
              <cl-icon
                :icon="['fa', 'external-link-alt']"
                @click="onChannelNavigate(option.value)"
              />
            </div>
          </el-space>
        </el-checkbox-group>
      </cl-form-item>
    </cl-form>
  </div>
</template>

<style lang="scss" scoped>
.notification-setting-detail-tab-channels {
  margin: 20px;

  &:deep(.icon) {
    color: var(--cl-primary-color);
    margin-left: 5px;
    cursor: pointer;
    height: 14px;
    width: 14px;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
