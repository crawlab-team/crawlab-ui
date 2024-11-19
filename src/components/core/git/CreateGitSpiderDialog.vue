<script setup lang="tsx">
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { FILE_ROOT } from '@/constants';
import { translate } from '@/utils';
import { getRootDirectoryOptions } from '@/utils/file';
import { useGitDetail } from '@/views';
import { ClNavLink } from '@/components';

const t = translate;

// store
const nsGit: ListStoreNamespace = 'git';
const nsSpider: ListStoreNamespace = 'spider';
const store = useStore<RootStoreState>();
const { git: gitState, spider: spiderState } = store.state as RootStoreState;

const { activeId } = useGitDetail();

const formRef = ref();

const visible = computed(() => gitState.activeDialogKey === 'createSpider');
const loading = computed(() => gitState.createSpiderLoading);

const onClose = () => {
  store.commit(`${nsGit}/hideDialog`);
};

const onConfirm = async () => {
  await formRef.value?.validate();
  store.commit(`${nsGit}/setCreateSpiderLoading`, true);
  try {
    const res = await store.dispatch(`${nsGit}/createSpider`, {
      id: activeId.value,
      spider: spiderState.form,
    });
    const spiderId = res.data._id;
    ElMessage.success(
      <>
        <span class="el-message__content">
          {t('components.git.common.message.success.createSpider.title')}
        </span>
        <span class="el-message__content">
          <ClNavLink
            path={`/spiders/${spiderId}`}
            label={t(
              'components.git.common.message.success.createSpider.action'
            )}
          />
        </span>
      </>
    );
    await store.dispatch(`${nsSpider}/getAllList`, { id: activeId.value });
  } catch (e) {
    ElMessage.error((e as Error).message);
  } finally {
    store.commit(`${nsGit}/setCreateSpiderLoading`, false);
    store.commit(`${nsGit}/hideDialog`);
  }
};

const gitRootPath = ref<string>(FILE_ROOT);
const directoryOptions = computed(() =>
  getRootDirectoryOptions(gitState.fileNavItems)
);
watch(gitRootPath, () => {
  store.commit(`${nsSpider}/setForm`, {
    ...spiderState.form,
    git_root_path: gitRootPath.value,
  });
});
watch(visible, () => {
  if (visible.value) {
    store.dispatch(`${nsGit}/listDir`, { id: activeId.value });
    gitRootPath.value = gitState.activeFileNavItem?.path || FILE_ROOT;
    const name = [gitState.form.name, gitRootPath.value]
      .filter(f => f !== FILE_ROOT)
      .join('/');
    const colName = 'results_' + name?.replace(/[\/\-~]/g, '_');
    store.commit(`${nsSpider}/setForm`, {
      ...spiderState.newFormFn(),
      name,
      col_name: colName,
      git_id: activeId.value,
    });
  } else {
    gitRootPath.value = FILE_ROOT;
  }
});

defineOptions({ name: 'ClCreateGitSpiderDialog' });
</script>

<template>
  <cl-dialog
    type="create"
    :visible="visible"
    :confirm-loading="loading"
    width="80vw"
    @close="onClose"
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
