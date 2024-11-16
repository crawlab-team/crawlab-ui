<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeMount,
  onMounted,
  Ref,
  ref,
  watch,
} from 'vue';
import {
  FORM_FIELD_TYPE_INPUT,
  FORM_FIELD_TYPE_INPUT_PASSWORD,
  FORM_FIELD_TYPE_INPUT_TEXTAREA,
  FORM_FIELD_TYPE_INPUT_WITH_BUTTON,
  FORM_FIELD_TYPE_SELECT,
  FORM_FIELD_TYPE_SWITCH,
} from '@/constants/form';
import { voidFunc } from '@/utils/func';
import { translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    form: any;
    formRules?: FormRuleItem[];
    prop: string;
    fieldType: FormFieldType;
    options?: SelectOption[];
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (value: any) => void;
    onRegister?: (formRef: Ref) => void;
  }>(),
  {
    placeholder: 'components.form.table.field.defaultPlaceholder',
    onChange: voidFunc,
    onRegister: voidFunc,
  }
);

// i18n
const t = translate;

// form ref
const formRef = ref();

// form item ref
const formItemRef = ref();

// internal value
const internalValue = ref<any>();

// computed field value
const fieldValue = computed(() => {
  const { form, prop } = props;
  return form[prop];
});
watch(
  () => fieldValue.value,
  () => {
    if (internalValue.value !== fieldValue.value) {
      internalValue.value = fieldValue.value;
    }
  }
);

const onInputChange = (value: any) => {
  const { onChange } = props;
  onChange?.(value);
};

const isEmptyForm = inject('fn:isEmptyForm') as (d: any) => boolean;

const isRequired = computed<boolean>(() => {
  const { form, required } = props;
  if (isEmptyForm(form)) return false;
  return required || false;
});

const isErrorMessageVisible = computed<boolean>(
  () => !!formItemRef.value?.validateMessage
);

const computedFormRules = computed<FormRuleItem[]>(() => {
  const { form, formRules } = props;
  if (isEmptyForm(form)) {
    return [];
  } else {
    return formRules || [];
  }
});

onBeforeMount(() => {
  const { form, prop } = props;

  // initialize internal value
  internalValue.value = form[prop];
});

onMounted(() => {
  const { onRegister } = props;

  // register form ref
  onRegister?.(formRef);
});
defineOptions({ name: 'ClFormTableField' });
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="computedFormRules"
    inline-message
  >
    <el-form-item ref="formItemRef" :prop="prop" :required="isRequired">
      <el-input
        v-if="fieldType === FORM_FIELD_TYPE_INPUT"
        v-model="internalValue"
        :placeholder="t(placeholder)"
        :disabled="disabled"
        @input="onInputChange"
      />
      <el-input
        v-else-if="fieldType === FORM_FIELD_TYPE_INPUT_PASSWORD"
        v-model="internalValue"
        :disabled="disabled"
        :placeholder="t(placeholder)"
        type="password"
        @input="onInputChange"
      />
      <el-input
        v-else-if="fieldType === FORM_FIELD_TYPE_INPUT_TEXTAREA"
        v-model="internalValue"
        :placeholder="t(placeholder)"
        type="textarea"
        :disabled="disabled"
        @input="onInputChange"
      />
      <el-select
        v-else-if="fieldType === FORM_FIELD_TYPE_SELECT"
        v-model="internalValue"
        :placeholder="t(placeholder)"
        :disabled="disabled"
        @change="onInputChange"
      >
        <el-option
          v-for="op in options"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        />
      </el-select>
      <el-input
        v-else-if="fieldType === FORM_FIELD_TYPE_INPUT_WITH_BUTTON"
        v-model="internalValue"
        :placeholder="t(placeholder)"
        :button-label="t('common.actions.edit')"
        :disabled="disabled"
        @input="onInputChange"
      />
      <cl-switch
        v-else-if="fieldType === FORM_FIELD_TYPE_SWITCH"
        v-model="internalValue"
        :disabled="disabled"
        @change="onInputChange"
      />
      <!-- TODO: implement more field types -->
    </el-form-item>
  </el-form>
</template>

<style scoped>
.el-form {
  margin: 0;

  .el-form-item {
    margin: 0;
  }
}
</style>
