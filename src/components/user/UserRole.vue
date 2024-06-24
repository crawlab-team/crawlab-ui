<script setup lang="ts">
defineOptions({ name: 'ClUserRole' });
import { computed } from 'vue';
import { ROLE_ADMIN } from '@/constants/user';

export type UserRole = 'admin' | 'normal';

const props = defineProps<{
  role?: UserRole;
  label?: string;
}>();

const type = computed<string>(() => {
  const { role } = props;
  return role === ROLE_ADMIN ? '' : 'warning';
});

const computedLabel = computed<string>(() => {
  const { role, label } = props;
  if (label) return label;
  return role === ROLE_ADMIN ? 'Admin' : 'Normal';
});

const icon = computed<string[]>(() => {
  const { role } = props;
  return role === ROLE_ADMIN ? ['fa', 'star'] : ['fa', 'user'];
});
</script>

<template>
  <el-tag :type="type" class="user-role">
    <font-awesome-icon :icon="icon" class="icon" />
    <span>{{ computedLabel }}</span>
  </el-tag>
</template>

<style lang="scss" scoped>
.user-role {
  .icon {
    margin-right: 5px;
  }
}
</style>
