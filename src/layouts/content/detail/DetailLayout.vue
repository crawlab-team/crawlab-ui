<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useDetail } from '@/layouts';

const props = withDefaults(
  defineProps<{
    storeNamespace: ListStoreNamespace;
    navItemNameKey?: string;
    showBackButton?: boolean;
    showSaveButton?: boolean;
    allListSelectOptions?: SelectOption[];
  }>(),
  {
    navItemNameKey: 'name',
    showSaveButton: true,
    showBackButton: true,
  }
);

const ns = computed(() => props.storeNamespace);
const store = useStore();

const {
  activeId,
  activeTabName,
  getForm,
  navLoading,
  onNavSelect,
  onNavTabsSelect,
  onBack,
  onSave,
  tabs,
} = useDetail(ns.value);

const computedTabs = computed<NavItem[]>(() =>
  tabs.value.map((tab: NavItem) => ({ ...tab }))
);

const computedAllListSelectOptions = computed(() => {
  if (props.allListSelectOptions) {
    return props.allListSelectOptions;
  }
  return store.state[ns.value].allList.map((item: BaseModel) => ({
    label: item[props.navItemNameKey],
    value: item._id,
  }));
});

// get form before mount
onBeforeMount(getForm);

// get all list before mount
onBeforeMount(async () => {
  await store.dispatch(`${ns.value}/getAllList`);
});

// reset form before unmount
onBeforeUnmount(() => {
  if (!activeTabName.value) {
    store.commit(`${ns.value}/resetForm`);
  }
});

defineOptions({ name: 'ClDetailLayout' });
</script>

<template>
  <div class="detail-layout">
    <div v-loading="navLoading" class="content">
      <cl-nav-tabs
        :active-key="activeTabName"
        :items="computedTabs"
        class="nav-tabs"
        @select="onNavTabsSelect"
      >
        <template #extra>
          <div class="nav-select">
            <cl-icon :icon="['fa', 'exchange-alt']" size="small" />
            <el-select
              :model-value="activeId"
              size="small"
              placement="bottom-end"
              filterable
              @change="onNavSelect"
            >
              <el-option
                v-for="op in computedAllListSelectOptions"
                :key="op.value"
                :label="op.label"
                :value="op.value"
              />
            </el-select>
          </div>
        </template>
      </cl-nav-tabs>
      <cl-nav-actions class="nav-actions">
        <cl-nav-action-group-detail-common
          :show-back-button="showBackButton"
          :show-save-button="showSaveButton"
          @back="onBack"
          @save="onSave"
        />
        <slot name="actions" />
      </cl-nav-actions>
      <div class="content-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-layout {
  display: flex;
  height: 100%;

  .content {
    flex: 1;
    width: 100%;
    height: 100%;
    background-color: var(--cl-container-white-bg);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .nav-actions {
      height: fit-content;
    }

    .nav-select {
      width: 180px;
      margin-right: 10px;
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--cl-info-medium-color);

      .el-select {
        flex: 1;
      }
    }

    .content-container {
      flex: 1;
      height: calc(100% - 41px - 50px);
    }
  }
}
</style>
