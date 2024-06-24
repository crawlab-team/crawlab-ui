<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { emptyObjectFunc } from '@/utils/func';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'SidebarItem',
  props: {
    item: {
      type: Object as PropType<MenuItem>,
      default: emptyObjectFunc,
    },
  },
  emits: ['click'],
  setup(props: SidebarItemProps, { emit }) {
    const { t } = useI18n();

    const onMenuItemClick = (item: MenuItem) => {
      emit('click', item);
    };

    return {
      onMenuItemClick,
      t,
    };
  },
});
</script>

<template>
  <!-- no sub menu items -->
  <el-menu-item
    v-if="!item.children"
    v-track="{
      code: 'click_sidebar_menu_item',
      params: {
        path: item.path,
      },
    }"
    :index="item.path"
    @click="onMenuItemClick(item)"
  >
    <cl-menu-item-icon :item="item" size="normal" />
    <template #title>
      <span class="menu-item-title">{{ t(item.title) }}</span>
    </template>
  </el-menu-item>
</template>

<style lang="scss" scoped>
.el-menu-item * {
  vertical-align: middle;
}

.el-menu-item,
.el-sub-menu {
  &.is-active {
    background-color: var(--cl-menu-hover) !important;
  }

  .menu-item-title {
    margin-left: 6px;
  }
}
</style>
