<script setup lang="ts">
defineOptions({ name: 'ClSystemDetail' });
import { onBeforeMount, ref } from 'vue';
import { translate } from '@/utils';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

const t = translate;

const ns = 'system';
const store = useStore();
const { system: state } = store.state as RootStoreState;

const siteTitle = ref<Setting>({
  key: 'site_title',
  value: {
    customize_site_title: false,
    site_title: '',
  },
});
const onSiteTitleChange = () => {
  store.commit(`${ns}/setSiteTitle`, siteTitle.value);
};
onBeforeMount(async () => {
  await store.dispatch(`${ns}/getSiteTitle`);
  siteTitle.value = state.siteTitle;
});

const onSave = async () => {
  await store.dispatch(`${ns}/saveSiteTitle`);
  ElMessage.success(t('common.message.success.save'));
};
</script>

<template>
  <div class="system-detail">
    <cl-nav-actions>
      <cl-nav-action-group-detail-common
        :show-back-button="false"
        :show-save-button="true"
        @save="onSave"
      />
    </cl-nav-actions>
    <cl-form>
      <cl-form-item :span="1" :label="t('views.system.customizeSiteTitle')">
        <cl-switch
          v-model="siteTitle.value.customize_site_title"
          @change="onSiteTitleChange"
        />
      </cl-form-item>
      <cl-form-item :span="3" :label="t('views.system.siteTitle')">
        <el-input
          v-model="siteTitle.value.site_title"
          :disabled="!siteTitle.value.customize_site_title"
          placeholder="网站标题"
          @change="onSiteTitleChange"
        />
      </cl-form-item>
    </cl-form>
  </div>
</template>

<style lang="scss" scoped>
.system-detail {
  background-color: #ffffff;
  min-height: 100%;

  .el-form {
    padding: 20px;
  }
}
</style>
