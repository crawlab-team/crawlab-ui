<script setup lang="ts">
import { translate } from '@/utils';
import { ref, watch } from 'vue';

const props = defineProps<{
  activeItem?: DatabaseDatabase;
}>();

const t = translate;

const form = ref<DatabaseTable>(props.activeItem || {});
watch(
  () => props.activeItem,
  () => {
    form.value = props.activeItem || {};
  }
);
defineOptions({ name: 'ClDatabaseDatabaseDetail' });
</script>

<template>
  <div class="database-database-detail">
    <cl-form :model="form">
      <cl-form-item
        :span="4"
        :label="t('components.database.databases.database.name')"
        prop="name"
        required
      >
        <el-input
          v-model="form.name"
          :placeholder="t('components.database.databases.database.name')"
        />
      </cl-form-item>
    </cl-form>
  </div>
</template>

<style scoped>
.database-database-detail {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
</style>
