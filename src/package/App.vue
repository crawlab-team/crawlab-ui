<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import en from 'element-plus/es/locale/lang/en';
import zh from 'element-plus/es/locale/lang/zh-cn';
import { getI18n } from '@/i18n';

// store
const store = useStore();

// locale
const locale = computed(() => {
  const lang = getI18n().global.locale.value;
  return lang === 'zh' ? zh : en;
});

onBeforeMount(() => {
  // system info
  store.dispatch('common/getSystemInfo');
});
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>
