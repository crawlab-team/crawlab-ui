<script lang="ts">
import { defineComponent } from 'vue';
import useUserDetail from '@/views/user/detail/useUserDetail';

export default defineComponent({
  name: 'UserDetail',
  setup() {
    return {
      ...useUserDetail(),
    };
  },
});
</script>

<template>
  <cl-detail-layout nav-item-name-key="username" store-namespace="user" />
</template>

<style lang="scss" scoped></style>
