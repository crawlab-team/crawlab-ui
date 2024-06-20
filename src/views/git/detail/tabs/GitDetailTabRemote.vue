<template>
  <div class="git-remote">
    <cl-git-form :branch-select-options="gitBranchSelectOptions" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ClGitDetailTabRemote' });
import { computed } from 'vue';
import { useStore } from 'vuex';

// store
const ns = 'git';
const store = useStore();

const gitBranchSelectOptions = computed<SelectOption[]>(
  () => store.getters[`${ns}/gitBranchSelectOptions`]
);
</script>

<style scoped lang="scss">
.git-remote {
  margin: 20px;
}
</style>
