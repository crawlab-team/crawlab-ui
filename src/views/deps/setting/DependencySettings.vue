<script setup lang="ts">
import { defineComponent, computed, ref, h } from 'vue';
import { ElMessage } from 'element-plus';
import useRequest from '@/services/request';
import { translate } from '@/utils';
import ClNavLink from '@/components/ui/nav/NavLink.vue';

const t = translate;

const endpoint = '/deps/settings';

const { getList, put } = useRequest();

const form = ref<any>({});

const dialogVisible = ref(false);

const tableColumns = computed(() => [
  {
    key: 'name',
    label: t('views.env.deps.settings.form.name'),
    icon: ['fa', 'font'],
    width: '150',
    value: (row: any) =>
      h(ClNavLink, {
        label: row.name,
        path: `/deps/${row.key}`,
      }),
  },
  {
    key: 'cmd',
    label: t('views.env.deps.settings.form.cmd'),
    icon: ['fa', 'terminal'],
    width: '200',
    value: (row: any) => t(row.cmd),
  },
  {
    key: 'proxy',
    label: t('views.env.deps.settings.form.proxy'),
    icon: ['fa', 'at'],
    width: '300',
    value: (row: any) => t(row.proxy),
  },
  {
    key: 'description',
    label: t('views.env.deps.settings.form.description'),
    icon: ['fa', 'comment-alt'],
    width: 'auto',
    value: (row: any) => t(row.description),
  },
  {
    key: 'actions',
    label: t('components.table.columns.actions'),
    fixed: 'right',
    width: '200',
    buttons: [
      {
        type: 'warning',
        icon: ['fa', 'cog'],
        tooltip: t('common.actions.manage'),
        onClick: (row: any) => {
          form.value = { ...row };
          dialogVisible.value = true;
        },
      },
    ],
    disableTransfer: true,
  },
]);

const tableData = ref([]);

const tablePagination = ref({
  page: 1,
  size: 10,
});

const tableTotal = ref(0);

const actionFunctions = ref({
  getList: async () => {
    const res = await getList(`${endpoint}`, {
      ...tablePagination.value,
    });
    if (!res) {
      tableData.value = [];
      tableTotal.value = 0;
    }
    const { data, total } = res;
    tableData.value = data as any;
    tableTotal.value = total;
  },
});

const onDialogClose = () => {
  form.value = {};
  dialogVisible.value = false;
};

const onDialogConfirm = async () => {
  if (!form.value._id) return;
  await put(`${endpoint}/${form.value._id}`, form.value);
  ElMessage.success(t('common.message.success.save'));
  form.value = {};
  dialogVisible.value = false;
  await actionFunctions.value.getList();
};

const onFormChange = (value: any) => {
  form.value = { ...value };
};
defineOptions({ name: 'ClDependencySettings' });
</script>

<template>
  <cl-list-layout
    :table-columns="tableColumns"
    :table-data="tableData"
    :table-total="tableTotal"
    :table-pagination="tablePagination"
    :action-functions="actionFunctions"
    no-actions
    :visible-buttons="['export', 'customize-columns']"
  >
    <template #extra>
      <cl-dialog
        :visible="dialogVisible"
        width="800px"
        @confirm="onDialogConfirm"
        @close="onDialogClose"
      >
        <cl-dependency-setting-form :form="form" @change="onFormChange" />
      </cl-dialog>
    </template>
  </cl-list-layout>
</template>

<style scoped></style>
