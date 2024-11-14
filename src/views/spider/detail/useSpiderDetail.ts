import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import useSpiderService from '@/services/spider/spiderService';
import { useDetail } from '@/layouts';

const useSpiderDetail = () => {
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

  onBeforeMount(() => store.dispatch(`node/getAllList`));

  return {
    ...useDetail<Spider>('spider'),
    saveFile,
  };
};

export default useSpiderDetail;
