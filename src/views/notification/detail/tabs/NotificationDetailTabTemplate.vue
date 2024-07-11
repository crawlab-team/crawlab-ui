<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import useNotification from '@/components/notification/notification';
import ClNotificationMarkdownEditor from '@/components/notification/NotificationMarkdownEditor.vue';

const t = translate;

// store
const ns = 'notification';
const store = useStore();
const { notification: state } = store.state as RootStoreState;

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

const internalContent = ref();
onMounted(() => {
  const { template } = form.value;
  internalContent.value = template;
});
watch(
  () => form.value.template,
  content => {
    internalContent.value = content;
  }
);

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
    <div class="editor-wrapper">
      <template v-if="state.templateMode === 'markdown'">
        <cl-notification-markdown-editor v-model="internalContent" />
      </template>
      <template v-else-if="state.templateMode === 'rich-text'">
        <cl-lexical-editor v-model="internalContent" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.notification-detail-tab-template {
  height: 100%;

  .title {
    height: 45px;

    &:deep(.el-input__wrapper) {
      border: none;
      border-radius: 0;
      border-bottom: 1px solid var(--el-border-color-light);
      box-shadow: none;
    }

    &:deep(.el-input__input) {
      height: 100%;
    }
  }

  .editor-wrapper {
    padding: 10px 0 0;
    height: calc(100% - 45px - 10px);
  }
}
</style>
