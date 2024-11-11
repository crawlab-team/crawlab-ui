<script setup lang="ts">
import { useStore } from 'vuex';
import { useRole } from '@/components';

const store = useStore();

const { routesOptions } = useRole(store);
defineOptions({ name: 'ClRoleDetailTabUsers' });
</script>

<template></template>

<style scoped></style>
