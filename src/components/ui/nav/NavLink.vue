<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  path?: string;
  label?: string | number | boolean;
  icon?: Icon;
  external?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const router = useRouter();

const onClick = () => {
  const { path, external } = props;
  if (external) {
    window.open(path);
    return;
  }
  if (path) {
    router.push(path);
  }
  emit('click');
};
defineOptions({ name: 'ClNavLink' });
</script>

<template>
  <div class="nav-link" @click="onClick">
    <cl-icon :icon="icon" class="icon" />
    <span class="title">{{ label }}</span>
  </div>
</template>

<style lang="scss" scoped>
.nav-link {
  cursor: pointer;
  color: var(--cl-blue);

  &:hover {
    text-decoration: underline;
  }

  &:deep(.icon) {
    margin-right: 3px;
  }
}
</style>
