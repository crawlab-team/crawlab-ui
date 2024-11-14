import { computed } from 'vue';
import { Store } from 'vuex';
import useForm from '@/components/ui/form/useForm';
import useUserService from '@/services/user/userService';
import { getDefaultFormComponentData } from '@/utils/form';
import { getModeOptions } from '@/utils/task';
import { ROLE_ADMIN, ROLE_NORMAL } from '@/constants/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import { translate } from '@/utils/i18n';

// i18n
const t = translate;

// form component data
const formComponentData = getDefaultFormComponentData<User>();

const useUser = (store: Store<RootStoreState>) => {
  // store
  const ns = 'user';
  const state = store.state[ns];

  // options for default mode
  const modeOptions = getModeOptions();

  // form rules
  const formRules: FormRules = {
    password: {
      trigger: 'blur',
      validator: (_, value: string, callback) => {
        const invalidMessage =
          'Invalid password. Length must be no less than 5.';
        if (0 < value.length && value.length < 5)
          return callback(invalidMessage);
        return callback();
      },
    },
  };

  // all user select options
  const allUserSelectOptions = computed<SelectOption[]>(() =>
    state.allList.map(d => {
      return {
        label: d.username,
        value: d._id,
      };
    })
  );

  // on change password
  const onChangePasswordFunc = async (id?: string) => {
    if (!id) return;

    const { value } = await ElMessageBox.prompt(
      t('components.user.messageBox.prompt.changePassword'),
      t('components.user.form.changePassword'),
      {
        inputType: 'password',
        inputPlaceholder: t('components.user.form.newPassword'),
        inputValidator: (value: string) => {
          return value?.length < 5
            ? t('components.user.rules.invalidPassword')
            : true;
        },
        confirmButtonClass: 'edit-user-password-confirm-btn',
        cancelButtonClass: 'edit-user-password-cancel-btn',
      }
    );
    await store.dispatch(`${ns}/changePassword`, { id, password: value });
    ElMessage.success(t('common.message.success.save'));
  };

  const rolesOptions: SelectOption[] = [
    { label: t('components.user.role.admin'), value: ROLE_ADMIN },
    { label: t('components.user.role.normal'), value: ROLE_NORMAL },
  ];

  return {
    ...useForm<User>('user', store, useUserService(store), formComponentData),
    modeOptions,
    formRules,
    allUserSelectOptions,
    onChangePasswordFunc,
    rolesOptions,
  };
};

export default useUser;
