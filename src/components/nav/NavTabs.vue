<script setup lang="ts">
defineOptions({ name: 'ClNavTabs' });
import { translate } from '@/utils';

const t = translate;

defineProps<{
  items: NavItem[];
  activeKey: string;
  collapsed: boolean;
  toggle: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', index: string): void;
  (e: 'toggle'): void;
}>();

const onSelect = (index: string) => {
  emit('select', index);
};

const onToggle = () => {
  emit('toggle');
};

const getClassName = (item: NavItem): string => {
  const cls = [];
  if (item.emphasis) cls.push('emphasis');
  if (item.id) cls.push(item.id);
  return cls.join(' ');
};
</script>

<template>
  <div class="nav-tabs">
    <el-tooltip
      v-if="toggle"
      :content="
        collapsed
          ? t('components.nav.tabs.toggle.expand')
          : t('components.nav.tabs.toggle.collapse')
      "
    >
      <div class="toggle" @click="onToggle">
        <cl-icon :icon="collapsed ? ['fa', 'indent'] : ['fa', 'outdent']" />
      </div>
    </el-tooltip>
    <el-menu :default-active="activeKey" mode="horizontal" @select="onSelect">
      <el-menu-item
        v-for="item in items"
        :key="item.id"
        :class="getClassName(item)"
        :index="item.id"
        :style="item.style"
        :disabled="item.disabled"
      >
        <el-tooltip :content="item.tooltip" :disabled="!item.tooltip">
          <div class="item-wrapper">
            <cl-icon :icon="item.icon" />
            <span class="label">
              {{ item.title ? t(item.title) : '' }}
            </span>
          </div>
        </el-tooltip>
      </el-menu-item>
    </el-menu>
    <div class="extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-tabs {
  display: flex;
  border-bottom: 1px solid #e6e6e6;

  .toggle {
    flex: 0 0 40px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-right: 1px solid #e6e6e6;
  }

  .el-menu {
    flex: 1 0 auto;
    display: flex;
    height: var(--cl-nav-tabs-height);
    border-bottom: none;

    .el-menu-item {
      height: var(--cl-nav-tabs-height);
      line-height: var(--cl-nav-tabs-height);

      &:hover {
        color: var(--cl-primary-color);
        background: inherit;
      }

      &:focus {
        background: inherit;
      }

      &.emphasis {
        color: var(--cl-info-color);
        border-bottom: none;
      }

      .item-wrapper {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 3px;
        }
      }
    }
  }

  .extra {
    background: transparent;
    display: flex;
    align-items: center;
    height: var(--cl-nav-tabs-height);
  }
}
</style>
<style scoped>
.nav-tabs:deep(.el-menu-item .icon) {
  margin-right: 5px;
}
</style>
