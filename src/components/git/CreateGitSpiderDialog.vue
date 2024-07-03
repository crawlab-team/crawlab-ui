<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { FILE_ROOT } from '@/constants';
import { translate } from '@/utils';
import { getRootDirectoryOptions } from '@/utils/file';
import useGitDetail from '@/views/git/detail/useGitDetail';

const t = translate;

const props = withDefaults(
  defineProps<{
    visible?: boolean;
    loading?: boolean;
    width: string;
  }>(),
  {
    width: '80vw',
  }
);

const emit = defineEmits<{
  (e: 'confirm', spider: Spider): void;
  (e: 'close'): void;
}>();

// store
const store = useStore<RootStoreState>();
const { git: gitState, spider: spiderState } = store.state as RootStoreState;
const { activeId } = useGitDetail();

const formRef = ref();

const onConfirm = async () => {
  await formRef.value?.validate();
  emit('confirm', spiderState.form);
};

const gitRootPath = ref<string>(FILE_ROOT);
const directoryOptions = computed(() =>
  getRootDirectoryOptions(gitState.fileNavItems)
);
watch(gitRootPath, () => {
  store.commit(`spider/setForm`, {
    ...spiderState.form,
    git_root_path: gitRootPath.value,
  });
});
watch(
  () => props.visible,
  () => {
    if (props.visible) {
      store.commit(`spider/setForm`, {
        ...spiderState.form,
        git_id: activeId.value,
      });
      store.dispatch(`git/listDir`, { id: activeId.value });
    } else {
      store.commit(`spider/resetForm`);
    }
  }
);
defineOptions({ name: 'ClCreateGitSpiderDialog' });
</script>

<template>
  <cl-dialog
    type="create"
    :visible="visible"
    :confirm-loading="loading"
    :width="width"
    @close="emit('close')"
    @confirm="onConfirm"
  >
    <template #default>
      <cl-spider-form ref="formRef">
        <template #header>
          <cl-form-item
            :span="4"
            :label="t('components.spider.form.gitRootPath')"
          >
            <el-tree-select
              v-model="gitRootPath"
              :data="directoryOptions"
              check-strictly
              :default-expanded-keys="[FILE_ROOT]"
              :render-after-expand="false"
              clearable
              filterable
              @clear="gitRootPath = FILE_ROOT"
            >
              <template #label="{ value, label }">
                <span v-if="value === FILE_ROOT">
                  {{ label }}
                </span>
                <span v-else>
                  {{ value }}
                </span>
              </template>
            </el-tree-select>
          </cl-form-item>
        </template>
      </cl-spider-form>
    </template>
  </cl-dialog>
</template>

<style scoped lang="scss"></style>
