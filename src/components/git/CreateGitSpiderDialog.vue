<script setup lang="ts">
defineOptions({ name: 'ClCreateGitSpiderDialog' });
import { ref } from 'vue';
import { useStore } from 'vuex';
import useGit from '@/components/git/useGit';

defineProps<{
  visible?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm', spider: Spider): void;
  (e: 'close'): void;
}>();

// store
const store = useStore<RootStoreState>();
const { spider: spiderState } = store.state as RootStoreState;

const formRef = ref();

const onConfirm = async () => {
  await formRef.value?.validate();
  emit('confirm', spiderState.form);
};
</script>

<template>
  <cl-dialog
    type="create"
    :visible="visible"
    :confirm-loading="loading"
    @close="emit('close')"
    @confirm="onConfirm"
  >
    <template #default>
      <cl-spider-form ref="formRef" />
    </template>
  </cl-dialog>
</template>

<style scoped lang="scss"></style>
