<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import useNotification from '@/components/notification/notification';

const t = translate;

// store
const ns = 'notification';
const store = useStore();

const { form } = useNotification(store);

const internalTitle = ref();
onMounted(() => {
  const { title } = form.value;
  internalTitle.value = title;
});
watch(
  () => form.value.title,
  title => {
    internalTitle.value = title;
  }
);
const onTitleChange = (title: string) => {
  store.commit(`${ns}/setTemplateTitle`, title);
};

defineOptions({ name: 'ClNotificationDetailTabTemplate' });
</script>

<template>
  <div class="notification-detail-tab-template">
    <el-input
      v-model="internalTitle"
      class="title"
      :placeholder="t('views.notification.settings.form.title')"
      @input="onTitleChange"
    />
    <cl-lexical-editor />
  </div>
</template>

<style scoped lang="scss">
.notification-detail-tab-template {
  display: flex;
  flex-direction: column;
  height: 100%;

  .editor {
    flex: 1;
    padding: 20px;
  }
}
</style>
<style scoped>
.notification-detail-tab-template .title:deep(.el-input__wrapper) {
  border: none;
  border-radius: 0;
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: none;
  height: 45px;
}

.notification-detail-tab-template .title:deep(.el-input__inner) {
  height: 100%;
}
</style>
