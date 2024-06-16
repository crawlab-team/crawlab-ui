import {watch, computed, ref, onBeforeMount, onMounted} from 'vue';
import {useStore} from 'vuex';
import useSpiderService from '@/services/spider/spiderService';
import {useRoute, useRouter} from 'vue-router';
import useGitService from '@/services/git/gitService';
import {getTabName} from '@/utils/route';
import {ElMessage, ElMessageBox} from 'element-plus';
import {sendEvent} from '@/admin/umeng';
import {translate} from '@/utils/i18n';
import Form from '@/components/form/Form.vue';
import {GIT_REF_TYPE_BRANCH} from '@/constants/git';
import useDetail from '@/layouts/content/detail/useDetail';

// i18n
const t = translate;

const useSpiderDetail = () => {
  const nsDc = 'dataCollection';
  const store = useStore();
  const {
    spider: state,
  } = store.state as RootStoreState;

  const route = useRoute();

  const id = computed(() => route.params.id as string);

  const activeNavItem = computed<FileNavItem | undefined>(() => state.activeNavItem);

  const fileContent = computed<string>(() => state.fileContent);

  const {
    saveFile: save,
  } = useSpiderService(store);

  const saveFile = async () => {
    if (!id.value || !activeNavItem.value?.path) return;
    await save(id.value, activeNavItem.value?.path, fileContent.value);
  };

  watch(() => state.form?.col_id, (val) => {
    if (val) {
      store.dispatch(`${nsDc}/getById`, val);
    }
  });

  onBeforeMount(() => store.dispatch(`node/getAllList`));

  return {
    ...useDetail('spider'),
    saveFile,
  };
};

export default useSpiderDetail;
