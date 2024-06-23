<script setup lang="ts">
defineOptions({ name: 'ClNavLink' });
import { useRouter } from 'vue-router';
import { sendEvent } from '@/admin/umeng';

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

  sendEvent('click_nav_link', {
    path,
    external,
    currentPath: router.currentRoute.value.path,
  });
};
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

  .icon {
    margin-right: 3px;
  }
}
</style>
