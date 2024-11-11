<script setup lang="ts">
import { useStore } from 'vuex';
import { useRole } from '@/components';

const store = useStore();

const { routesOptions } = useRole(store);
defineOptions({ name: 'ClRoleDetailTabPages' });
</script>

<template>
  <el-scrollbar>
    <cl-routes-form :options="routesOptions" />
  </el-scrollbar>
</template>

<style scoped>
.routes-form {
  margin: 10px 20px;
  height: 100%;
  overflow: auto;
}
</style>
