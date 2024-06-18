<template>
  <div class="file-editor-create-with-ai-dialog">
    <el-dialog
      :model-value="visible"
      :title="t('components.file.editor.createWithAi.title')"
      @close="onClose"
    >
      <el-form label-width="120px" class="form" ref="formRef" :model="form">
        <el-form-item
          :label="t('components.file.editor.createWithAi.form.fileName')"
          prop="fileName"
          required
        >
          <el-input
            v-model="form.fileName"
            :placeholder="
              t('components.file.editor.createWithAi.form.fileName')
            "
          />
        </el-form-item>
        <el-form-item
          :label="t('components.file.editor.createWithAi.form.url')"
          prop="url"
          required
        >
          <el-input
            v-model="form.url"
            :placeholder="t('components.file.editor.createWithAi.form.url')"
          />
        </el-form-item>
        <el-form-item
          :label="t('components.file.editor.createWithAi.form.language')"
          prop="language"
        >
          <el-select v-model="form.language" clearable>
            <el-option
              v-for="(op, $index) in languages"
              :key="$index"
              :label="op.label"
              :value="op.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="t('components.file.editor.createWithAi.form.framework')"
          prop="framework"
        >
          <el-select v-model="form.framework" clearable>
            <el-option
              v-for="(op, $index) in frameworks"
              :key="$index"
              :label="op.label"
              :value="op.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="t('components.file.editor.createWithAi.form.prompt')"
          prop="prompt"
          required
        >
          <el-input
            v-model="form.prompt"
            type="textarea"
            :placeholder="t('components.file.editor.createWithAi.form.prompt')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button plain type="info" @click="onClose">{{
          t('common.actions.cancel')
        }}</el-button>
        <el-button type="primary" :loading="loading" @click="onConfirm">{{
          t('common.actions.confirm')
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { onBeforeRouteLeave } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useRequest from '@/services/request';
import { ElMessage } from 'element-plus';

const { post } = useRequest();

export default defineComponent({
  name: 'FileEditorCreateWithAiDialog',
  emits: ['create'],
  setup(_, { emit }) {
    const { t } = useI18n();

    const storeNamespace = 'file';
    const store = useStore();
    const { file } = store.state as RootStoreState;

    const visible = computed<boolean>(() => {
      const { editorCreateWithAiDialogVisible } = file;
      return editorCreateWithAiDialogVisible;
    });

    const form = ref({
      fileName: '',
      url: '',
      language: 'Python',
      framework: '',
      prompt: 'all relevant data',
    });
    const formRef = ref();

    const languages = computed<SelectOption[]>(() => {
      return [
        { label: 'Python', value: 'Python' },
        { label: 'Node.js', value: 'Node.js' },
        { label: 'Golang', value: 'Golang' },
        { label: 'C#', value: 'C#' },
        { label: 'Java', value: 'Java' },
      ];
    });

    const frameworks = computed<SelectOption[]>(() => {
      switch (form.value.language) {
        case 'Python':
          return [
            { label: 'Scrapy', value: 'Scrapy' },
            { label: 'Selenium', value: 'Selenium' },
            { label: 'Requests', value: 'Requests' },
          ];
        case 'Node.js':
          return [
            { label: 'Puppeteer', value: 'Puppeteer' },
            { label: 'Request', value: 'Request' },
          ];
        case 'Golang':
          return [
            { label: 'Colly', value: 'Colly' },
            { label: 'Goquery', value: 'Goquery' },
          ];
        case 'C#':
          return [
            { label: 'ScrapySharp', value: 'ScrapySharp' },
            { label: 'HtmlAgilityPack', value: 'HtmlAgilityPack' },
          ];
        case 'Java':
          return [
            { label: 'Jsoup', value: 'Jsoup' },
            { label: 'WebMagic', value: 'WebMagic' },
            { label: 'Selenium', value: 'Selenium' },
          ];
        default:
          return [];
      }
    });

    const item = computed(() => file.editorFileNavItem);

    const onClose = () => {
      store.commit(
        `${storeNamespace}/setEditorCreateWithAiDialogVisible`,
        false
      );
    };

    const loading = ref(false);
    const onConfirm = async () => {
      await formRef.value.validate();

      loading.value = true;
      try {
        const res = await post('/ai/spider', {
          url: form.value.url,
          language: form.value.language,
          framework: form.value.framework,
          prompt: form.value.prompt,
        } as any);
        const sourceCode =
          res.data?.source_code || res.data?.output.source_code;
        store.commit(
          `${storeNamespace}/setEditorCreateWithAiDialogVisible`,
          false
        );
        emit('create', form.value.fileName, sourceCode, item.value);
      } catch (e: any) {
        ElMessage.error(e.message);
      } finally {
        loading.value = false;
      }
    };

    onBeforeRouteLeave(() => {
      store.commit(
        `${storeNamespace}/setEditorCreateWithAiDialogVisible`,
        false
      );
    });

    return {
      visible,
      form,
      formRef,
      languages,
      frameworks,
      loading,
      onClose,
      onConfirm,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>
.file-editor-create-with-ai-dialog {
  .nav-menu {
    .el-menu-item {
      height: 40px;
      line-height: 40px;
    }
  }

  .form {
    margin: 20px;
  }
}
</style>

<style scoped>
.file-editor-create-with-ai-dialog >>> .el-dialog .el-dialog__body {
  padding: 10px 20px;
}

.file-editor-create-with-ai-dialog
  >>> .el-dialog
  .el-dialog__body
  .el-form-item__label {
  word-break: break-word;
}

.file-editor-create-with-ai-dialog
  >>> .el-form-item
  > .el-form-item__label
  .icon {
  cursor: pointer;
}

.file-editor-create-with-ai-dialog >>> .el-form-item > .el-form-item__content {
  width: 240px;
}

.file-editor-create-with-ai-dialog
  >>> .el-form-item
  > .el-form-item__content
  .el-input,
.file-editor-create-with-ai-dialog
  >>> .el-form-item
  > .el-form-item__content
  .el-select {
  width: 100%;
}
</style>
<style>
.help-tooltip {
  max-width: 240px;
}
</style>
