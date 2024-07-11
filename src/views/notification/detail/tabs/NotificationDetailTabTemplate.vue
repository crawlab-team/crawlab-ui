<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/utils';
import { ElMessage } from 'element-plus';
import useNotificationDetail from '@/views/notification/detail/useNotificationDetail';

const t = translate;

// store
const ns = 'notification';
const store = useStore();
const { notification: state } = store.state as RootStoreState;

const { activeId } = useNotificationDetail();

const internalTitle = ref();
onMounted(() => {
  const { title } = state.form;
  internalTitle.value = title;
});
watch(
  () => state.form.title,
  title => {
    internalTitle.value = title;
  }
);
const onTitleChange = (title: string) => {
  store.commit(`${ns}/setTemplateTitle`, title);
};

const templateMarkdown = ref<string>();
const templateRichText = ref<string>();
onMounted(() => {
  templateMarkdown.value = state.form.template_markdown;
  templateRichText.value = state.form.template_rich_text;
});
watch(
  () => state.form.template_markdown,
  value => (templateMarkdown.value = value)
);
watch(templateMarkdown, () => {
  store.commit(`${ns}/setForm`, {
    ...state.form,
    template_markdown: templateMarkdown.value,
  });
});
watch(
  () => state.form.template_rich_text,
  value => (templateRichText.value = value)
);
watch(templateRichText, () => {
  store.commit(`${ns}/setForm`, {
    ...state.form,
    template_rich_text: templateRichText.value,
  });
});
watch(
  () => state.form.template_mode,
  mode => {
    if (mode === 'markdown') {
    } else if (mode === 'rich-text') {
    }
  }
);

const onSave = async () => {
  await store.dispatch(`${ns}/updateById`, {
    id: activeId.value,
    form: state.form,
  });
  ElMessage.success(t('common.message.success.save'));
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
    <div class="editor-wrapper">
      <template v-if="state.form.template_mode === 'markdown'">
        <cl-markdown-editor
          v-model="templateMarkdown"
          :id="state.form._id"
          :rich-text-content="templateRichText"
          @save="onSave"
        />
      </template>
      <template v-else-if="state.form.template_mode === 'rich-text'">
        <cl-lexical-editor
          v-model="templateRichText"
          :id="state.form._id"
          :markdown-content="templateMarkdown"
          @save="onSave"
        />
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
