<script setup lang="ts">
defineOptions({ name: 'ClDataSourceForm' });
import { computed } from 'vue';
import { getStore } from '@/store';
import useDataSource from '@/components/ds/useDataSource';
import { useI18n } from 'vue-i18n';
import useDataSourceDetail from '@/views/ds/detail/useDataSourceDetail';
import {
  DATA_SOURCE_CONNECT_TYPE_HOSTS,
  DATA_SOURCE_CONNECT_TYPE_STANDARD,
  DATA_SOURCE_CONNECT_TYPE_URL,
} from '@/constants/ds';

defineProps<{
  readonly?: boolean;
}>();

// i18n
const { t } = useI18n();

// store
const store = getStore();

const {
  form,
  formRef,
  isSelectiveForm,
  isFormItemDisabled,
  onConnectTypeChange,
  onChangePasswordFunc,
  onHostsAdd,
  onHostsDelete,
  typeOptions,
} = useDataSource(store);

const { activeId } = useDataSourceDetail();

const onChangePassword = () => onChangePasswordFunc(activeId.value);

const isDetail = computed<boolean>(() => !!activeId.value);
</script>

<template>
  <cl-form
    class="data-source-form"
    v-if="form"
    ref="formRef"
    :model="form"
    :selective="isSelectiveForm"
  >
    <!--Row-->
    <cl-form-item
      :span="2"
      :offset="2"
      :label="t('components.ds.form.name')"
      not-editable
      prop="name"
      required
    >
      <el-input
        v-model="form.name"
        :disabled="isFormItemDisabled('name')"
        :placeholder="t('components.ds.form.name')"
      />
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="2"
      :label="t('components.ds.form.type')"
      prop="type"
      required
    >
      <el-select
        v-model="form.type"
        :disabled="isFormItemDisabled('type')"
        :placeholder="t('components.ds.form.type')"
      >
        <el-option
          v-for="(op, $index) in typeOptions"
          :key="$index"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('components.ds.form.connectType')"
      prop="connect_type"
    >
      <el-radio-group
        v-model="form.connect_type"
        :disabled="isFormItemDisabled('connect_type')"
        @change="onConnectTypeChange"
      >
        <el-radio label="standard"
          >{{ t('components.ds.connectType.label.standard') }}
        </el-radio>
        <el-radio label="url"
          >{{ t('components.ds.connectType.label.url') }}
        </el-radio>
        <el-radio label="hosts"
          >{{ t('components.ds.connectType.label.hosts') }}
        </el-radio>
      </el-radio-group>
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <template v-if="form.connect_type === DATA_SOURCE_CONNECT_TYPE_STANDARD">
      <cl-form-item :span="2" :label="t('components.ds.form.host')" prop="host">
        <el-input
          v-model="form.host"
          :disabled="isFormItemDisabled('host')"
          :placeholder="t('components.ds.form.default.host')"
        />
      </cl-form-item>
      <cl-form-item :span="2" :label="t('components.ds.form.port')" prop="port">
        <el-input
          v-model="form.port"
          :disabled="isFormItemDisabled('port')"
          :placeholder="t('components.ds.form.default.port')"
        />
      </cl-form-item>
    </template>
    <template v-else-if="form.connect_type === DATA_SOURCE_CONNECT_TYPE_URL">
      <cl-form-item :span="4" :label="t('components.ds.form.url')" prop="url">
        <el-input
          v-model="form.url"
          :disabled="isFormItemDisabled('url')"
          :placeholder="t('components.ds.form.url')"
        />
      </cl-form-item>
    </template>
    <template v-else-if="form.connect_type === DATA_SOURCE_CONNECT_TYPE_HOSTS">
      <cl-form-item
        class="hosts-item"
        :span="4"
        :label="t('components.ds.form.hosts')"
        prop="hosts"
      >
        <el-row v-for="(_, $index) in form.hosts" :key="$index">
          <el-input
            class="hosts-item-input"
            v-model="form.hosts[$index]"
            :placeholder="t('components.ds.form.address')"
          />
          <cl-fa-icon-button
            :icon="['fa', 'plus']"
            type="info"
            plain
            :tooltip="t('common.actions.add')"
            @click="() => onHostsAdd($index)"
          />
          <cl-fa-icon-button
            :icon="['fa', 'remove']"
            type="info"
            plain
            :tooltip="t('common.actions.delete')"
            @click="() => onHostsDelete($index)"
          />
        </el-row>
      </cl-form-item>
    </template>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="2"
      :offset="2"
      :label="t('components.ds.form.database')"
      prop="database"
    >
      <el-input
        v-model="form.database"
        :disabled="isFormItemDisabled('database')"
        :placeholder="t('components.ds.form.default.database')"
      />
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="2"
      :label="t('components.ds.form.username')"
      prop="username"
    >
      <el-input
        v-model="form.username"
        :disabled="isFormItemDisabled('username')"
        :placeholder="t('components.ds.form.username')"
      />
    </cl-form-item>
    <cl-form-item
      :span="2"
      :label="t('components.ds.form.password')"
      prop="password"
    >
      <el-input
        v-if="isSelectiveForm || !isDetail"
        v-model="form.password"
        :disabled="isFormItemDisabled('password')"
        :placeholder="t('components.ds.form.password')"
        type="password"
      />
      <cl-label-button
        v-else
        :icon="['fa', 'lock']"
        :label="t('components.ds.form.changePassword')"
        type="danger"
        @click="onChangePassword"
      />
    </cl-form-item>
    <!--./Row-->

    <!--Row-->
    <cl-form-item
      :span="4"
      :label="t('components.ds.form.description')"
      prop="description"
    >
      <el-input
        v-model="form.description"
        :disabled="isFormItemDisabled('description')"
        :placeholder="t('components.ds.form.description')"
        type="textarea"
      />
    </cl-form-item>
    <!--./Row-->
  </cl-form>
</template>

<style scoped>
.data-source-form:deep(.hosts-item .hosts-item-input) {
  width: calc(100% - 10px - (10px + 32px) * 2);
  margin-right: 10px;
}

.data-source-form:deep(.hosts-item .el-button) {
  width: 32px;
}
</style>
