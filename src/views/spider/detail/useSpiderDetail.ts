import { watch, computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import useSpiderService from '@/services/spider/spiderService';
import { useRoute } from 'vue-router';
import { translate } from '@/utils/i18n';
import useDetail from '@/layouts/content/detail/useDetail';
import { FileNavItem } from '@/components/file/file';

// i18n
const t = translate;

const useSpiderDetail = () => {
  const nsDc = 'dataCollection';
  const store = useStore();
  const { spider: state } = store.state as RootStoreState;

  const route = useRoute();

  const id = computed(() => route.params.id as string);

  const activeNavItem = computed<FileNavItem | undefined>(
    () => state.activeNavItem
  );

  const fileContent = computed<string>(() => state.fileContent);

  const { saveFile: save } = useSpiderService(store);

  const saveFile = async () => {
    if (!id.value || !activeNavItem.value?.path) return;
    await save(id.value, activeNavItem.value?.path, fileContent.value);
  };

  watch(
    () => state.form?.col_id,
    async val => {
      if (val) {
        await store.dispatch(`${nsDc}/getById`, val);
      }
    }
  );

  onBeforeMount(() => store.dispatch(`node/getAllList`));

  return {
    ...useDetail('spider'),
    saveFile,
  };
};

export default useSpiderDetail;
