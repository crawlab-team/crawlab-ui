<script setup lang="tsx">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import useRequest from '@/services/request';
import { useSpiderDetail } from '@/views';
import {
  getNormalizedDependencies,
  getRepoExternalPath,
} from '@/utils/dependency';
import {
  ClDependencyVersions,
  ClTag,
  ClNavLink,
  ClNodeTag,
  useNode,
} from '@/components';
import { setupAutoUpdate, translate } from '@/utils';
import { ACTION_INSTALL, ACTION_UNINSTALL } from '@/constants';

type SpiderDependenciesResponse = ResponseWithData<{
  file_type: DependencyFileType;
  requirements: DependencyRequirement[];
}>;

const t = translate;

const { get } = useRequest();

const router = useRouter();

const nsDependency: ListStoreNamespace = 'dependency';
const store = useStore();
const { dependency: dependencyState } =
  store.state as RootStoreState;

const { activeId } = useSpiderDetail();

const { allDict: allNodeDict } = useNode(store);

const fileType = ref<DependencyFileType>();
const requirements = ref<DependencyRequirement[]>([]);

const onClickRequiredVersion = async () => {
  await router.push({
    path: `/spiders/${activeId.value}/files`,
    query: {
      open: fileType.value,
    },
  });
};

const onClickInstall = async (row: DependencyRequirement) => {
  store.commit(`${nsDependency}/setInstallForm`, {
    ...dependencyState.installForm,
    name: row.name,
  } as DependencyInstallForm);
  store.commit(`${nsDependency}/showDialog`, 'install');
};

const onClickUninstall = async (row: DependencyRequirement) => {
  store.commit(`${nsDependency}/setUninstallForm`, {
    ...dependencyState.uninstallForm,
    names: [row.name],
  } as DependencyUninstallForm);
  store.commit(`${nsDependency}/showDialog`, 'uninstall');
};

const tableColumns = computed<TableColumns<DependencyRepo>>(() => {
  return [
    {
      key: 'name',
      label: t('views.env.deps.dependency.form.name'),
      icon: ['fa', 'font'],
      width: '200',
      value: (row: DependencyRequirement) => {
        const path = getRepoExternalPath(row);
        if (!path) return row.name;
        return <ClNavLink label={row.name} path={path} external />;
      },
    },
    {
      key: 'version',
      label: t('views.env.deps.dependency.form.requiredVersion'),
      icon: ['fa', 'tag'],
      width: '150',
      value: (row: DependencyRequirement) => (
        <ClTag
          label={row.version || t('common.placeholder.empty')}
          clickable
          onClick={onClickRequiredVersion}
        />
      ),
    },
    {
      key: 'versions',
      label: t('views.env.deps.dependency.form.installedVersion'),
      icon: ['fa', 'tag'],
      width: '150',
      value: (row: DependencyRequirement) => (
        <ClDependencyVersions
          name={row.name}
          dependencies={getNormalizedDependencies(row.dependencies)}
          latestVersion={row.latest_version}
          requiredVersion={row.version}
          onClick={() => onClickInstall(row)}
        />
      ),
    },
    {
      key: 'node_ids',
      label: t('views.env.deps.dependency.form.installedNodes'),
      icon: ['fa', 'server'],
      width: '580',
      value: (row: DependencyRequirement) =>
        row.dependencies?.map(dep => {
          const node = allNodeDict.value.get(dep.node_id!);
          if (!node?.active) return;
          return (
            <ClNodeTag
              node={node}
              clickable
              onClick={() => {
                store.commit(`${nsDependency}/setActiveTargetId`, dep._id);
                store.commit(`${nsDependency}/setActiveTargetName`, dep.name);
                store.commit(`${nsDependency}/setActiveTargetStatus`, dep.status);
                store.commit(`${nsDependency}/showDialog`, 'logs');
              }}
            >
              {{
                'extra-items': () => {
                  let color: string;
                  switch (dep.status) {
                    case 'installing':
                    case 'uninstalling':
                      color = 'var(--cl-warning-color)';
                      break;
                    case 'installed':
                    case 'uninstalled':
                      color = 'var(--cl-success-color)';
                      break;
                    case 'error':
                    case 'abnormal':
                      color = 'var(--cl-danger-color)';
                      break;
                    default:
                      color = 'inherit';
                  }
                  return (
                    <>
                      <div class="tooltip-title">
                        <label>
                          {t('layouts.routes.dependencies.list.title')}
                        </label>
                      </div>
                      <div class="tooltip-item">
                        <label>
                          {t('views.env.deps.dependency.form.status')}:
                        </label>
                        <span
                          style={{
                            color,
                          }}
                        >
                          {t(`views.env.deps.dependency.status.${dep.status}`)}
                        </span>
                      </div>
                      {dep.error && (
                        <div class="tooltip-item">
                          <label>
                            {t('views.env.deps.dependency.form.error')}:
                          </label>
                          <span
                            style={{
                              color,
                            }}
                          >
                            {dep.error}
                          </span>
                        </div>
                      )}
                      {dep.version && (
                        <div class="tooltip-item">
                          <label>
                            {t('views.env.deps.dependency.form.version')}:
                          </label>
                          <span>{dep.version}</span>
                        </div>
                      )}
                    </>
                  );
                },
              }}
            </ClNodeTag>
          );
        }),
    },
    {
      key: 'actions',
      label: t('components.table.columns.actions'),
      fixed: 'right',
      width: '200',
      buttons: (_: DependencyRequirement) => [
        {
          tooltip: t('common.actions.install'),
          onClick: onClickInstall,
          action: ACTION_INSTALL,
        },
        {
          tooltip: t('common.actions.uninstall'),
          disabled: (row: DependencyRequirement) => {
            return !row.dependencies?.some(dep => {
              return dep.status === 'installed';
            });
          },
          onClick: onClickUninstall,
          action: ACTION_UNINSTALL,
        },
      ],
      disableTransfer: true,
    },
  ] as TableColumns<DependencyRepo>;
});

const tableData = computed(() => requirements.value);
const tableTotal = computed(() => requirements.value.length);
const tableLoading = ref(false);
const getData = async () => {
  tableLoading.value = true;
  try {
    const res = await get<any, SpiderDependenciesResponse>(
      `/dependencies/spiders/${activeId.value}`
    );
    fileType.value = res.data?.file_type;
    requirements.value = res.data?.requirements || [];
  } catch (e: any) {
    ElMessage.error(e.message);
  } finally {
    tableLoading.value = false;
  }
};

onBeforeMount(getData);
watch(activeId, getData);
setupAutoUpdate(getData, 10000);

defineOptions({ name: 'ClSpiderDetailTabDependencies' });
</script>

<template>
  <cl-list-layout
    :table-loading="tableLoading"
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    embedded
    no-actions
  >
    <template #extra>
      <cl-dependency-install-dialog />
      <cl-dependency-uninstall-dialog />
    </template>
  </cl-list-layout>
</template>
