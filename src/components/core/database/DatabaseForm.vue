<script setup lang="ts">
import { computed } from 'vue';
import { getStore } from '@/store';
import useDatabase from '@/components/core/database/useDatabase';
import useDatabaseDetail from '@/views/database/detail/useDatabaseDetail';
import {
  DATABASE_CONNECT_TYPE_HOSTS,
  DATABASE_CONNECT_TYPE_STANDARD,
  DATABASE_CONNECT_TYPE_URL,
} from '@/constants/database';
import { translate } from '@/utils';

defineProps<{
  readonly?: boolean;
}>();

// i18n
const t = translate;

// store
const store = getStore();
const { database: state } = store.state as RootStoreState;

const { formRef, isSelectiveForm, onChangePasswordFunc, dataSourceOptions } =
  useDatabase(store);

const { activeId } = useDatabaseDetail();

const onChangePassword = () => onChangePasswordFunc(activeId.value);

const isDetail = computed<boolean>(() => !!activeId.value);

const form = computed(() => state.form);

const isDisabled = computed(() => form.value.is_default);

defineOptions({ name: 'ClDatabaseForm' });
</script>

<template>
  <cl-form
    class="database-form"
    v-if="form"
    ref="formRef"
    :model="form"
    :selective="isSelectiveForm"
  >
    <!--Row-->
    <cl-form-item
      :span="2"
      :label="t('components.database.form.name')"
      not-editable
      prop="name"
      required
    >
      <el-input
        v-model="form.name"
        :placeholder="t('components.database.form.name')"
        :disabled="isDisabled"
      />
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="2"
      :label="t('components.database.form.dataSource')"
      prop="data_source"
      required
    >
      <el-select
        v-model="form.data_source"
        :placeholder="t('components.database.form.dataSource')"
        :disabled="isDisabled"
      >
        <el-option
          v-for="op in dataSourceOptions"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="2"
      :label="t('components.database.form.host')"
      prop="host"
      required
    >
      <el-input
        v-model="form.host"
        :placeholder="t('components.database.form.host')"
        :disabled="isDisabled"
      />
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('components.database.form.port')"
      prop="port"
      required
    >
      <el-input
        v-model="form.port"
        :placeholder="t('components.database.form.port')"
        :disabled="isDisabled"
      />
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="2"
      :offset="2"
      :label="t('components.database.form.database')"
      prop="database"
    >
      <el-input
        v-model="form.database"
        :placeholder="t('components.database.form.database')"
        :disabled="isDisabled"
      />
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="2"
      :label="t('components.database.form.username')"
      prop="username"
    >
      <el-input
        v-model="form.username"
        :placeholder="t('components.database.form.username')"
        :disabled="isDisabled"
      />
    </cl-form-item>
    <cl-form-item
      v-if="!isDisabled"
      :span="2"
      :label="t('components.database.form.password')"
      prop="password"
    >
      <el-input
        v-if="isSelectiveForm || !isDetail"
        v-model="form.password"
        :placeholder="t('components.database.form.password')"
        type="password"
        show-password
        :disabled="isDisabled"
      />
      <cl-label-button
        v-else
        :icon="['fa', 'lock']"
        :label="t('components.database.form.changePassword')"
        type="danger"
        :disabled="isDisabled"
        @click="onChangePassword"
      />
    </cl-form-item>
    <!--./Row-->

    <cl-form-item
      :span="4"
      :label="t('components.database.form.url')"
      prop="url"
    >
      <el-input
        v-model="form.url"
        :placeholder="t('components.database.form.url')"
        :disabled="isDisabled"
      />
    </cl-form-item>

    <!--Row-->
    <cl-form-item
      :span="4"
      :label="t('components.database.form.description')"
      prop="description"
    >
      <el-input
        v-model="form.description"
        :placeholder="t('components.database.form.description')"
        type="textarea"
        :disabled="isDisabled"
      />
    </cl-form-item>
    <!--./Row-->
  </cl-form>
</template>

<style scoped>
.database-form:deep(.hosts-item .hosts-item-input) {
  width: calc(100% - 10px - (10px + 32px) * 2);
  margin-right: 10px;
}

.database-form:deep(.hosts-item .el-button) {
  width: 32px;
}
</style>
