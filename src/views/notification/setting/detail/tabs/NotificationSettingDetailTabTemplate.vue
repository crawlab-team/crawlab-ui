<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { translate } from '@/utils';
import useNotificationSettingDetail from '@/views/notification/setting/detail/useNotificationSettingDetail';

const t = translate;

// store
const ns: ListStoreNamespace = 'notificationSetting';
const store = useStore();
const { notificationSetting: state } = store.state as RootStoreState;

const { activeId } = useNotificationSettingDetail();

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
const richTextPayload = ref<RichTextPayload>({
  richTextContent: '',
  richTextContentJson: '',
});
onMounted(() => {
  templateMarkdown.value = state.form.template_markdown;
  richTextPayload.value = {
    richTextContent: state.form.template_rich_text || '',
    richTextContentJson: state.form.template_rich_text_json || '',
  };
});
watch<NotificationSetting>(
  () => state.form,
  (currentForm, previousForm) => {
    // page change
    if (currentForm._id !== previousForm._id) {
      templateMarkdown.value = currentForm.template_markdown;
      richTextPayload.value = {
        richTextContent: currentForm.template_rich_text || '',
        richTextContentJson: currentForm.template_rich_text_json || '',
      };
      return;
    }

    // template mode change
    if (currentForm.template_mode !== previousForm.template_mode) {
      if (currentForm.template_mode === 'rich-text') {
        store.commit(`${ns}/setForm`, {
          ...state.form,
          template_rich_text: '',
          template_rich_text_json: '',
        });
      }
      return;
    }

    // form values change
    if (currentForm.template_markdown !== previousForm.template_markdown) {
      templateMarkdown.value = currentForm.template_markdown;
    }
    if (currentForm.template_rich_text !== previousForm.template_rich_text) {
      richTextPayload.value.richTextContent =
        currentForm.template_rich_text || '';
    }
    if (
      currentForm.template_rich_text_json !==
      previousForm.template_rich_text_json
    ) {
      richTextPayload.value.richTextContentJson =
        currentForm.template_rich_text_json || '';
    }
  }
);
watch(templateMarkdown, value => {
  store.commit(`${ns}/setForm`, {
    ...state.form,
    template_markdown: value,
  });
});
watch(
  () => JSON.stringify(richTextPayload.value),
  () => {
    if (!richTextPayload.value) return;
    store.commit(`${ns}/setForm`, {
      ...state.form,
      template_rich_text: richTextPayload.value.richTextContent,
      template_rich_text_json: richTextPayload.value.richTextContentJson,
    } as NotificationSetting);
  }
);

const onTitleKeydown = (event: KeyboardEvent) => {
  // ctrl/cmd + s
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault();
    onSave();
  }
};

const onSave = async () => {
  await store.dispatch(`${ns}/updateById`, {
    id: activeId.value,
    form: state.form,
  });
  ElMessage.success(t('common.message.success.save'));
};

defineOptions({ name: 'ClNotificationSettingDetailTabTemplate' });
</script>

<template>
  <div class="notification-setting-detail-tab-template">
    <el-input
      v-model="internalTitle"
      class="title"
      :placeholder="t('views.notification.settings.form.title')"
      @input="onTitleChange"
      @keydown="onTitleKeydown"
    >
      <template #prefix>
        <el-tooltip :content="t('views.notification.settings.form.title')">
          <span>
            <cl-icon :icon="['fa', 'heading']" />
          </span>
        </el-tooltip>
      </template>
    </el-input>
    <div class="editor-wrapper">
      <template v-if="state.form.template_mode === 'markdown'">
        <cl-markdown-editor
          v-model="templateMarkdown"
          :id="state.form._id"
          @save="onSave"
        />
      </template>
      <template v-else-if="state.form.template_mode === 'rich-text'">
        <cl-lexical-editor
          v-model="richTextPayload"
          :markdown-content="state.form.template_markdown"
          @save="onSave"
          @change-markdown="(value: string) => (templateMarkdown = value)"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.notification-setting-detail-tab-template {
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

    &:deep(.el-input__inner) {
      font-size: 16px;
    }
  }

  .editor-wrapper {
    padding: 0;
    height: calc(100% - 45px - 10px);
  }
}
</style>
