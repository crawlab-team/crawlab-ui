<script setup lang="ts">
import { translate } from '@/utils';

const t = translate;

const props = defineProps<{
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
        <font-awesome-icon
          :icon="collapsed ? ['fa', 'indent'] : ['fa', 'outdent']"
        />
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
          <template v-if="!!item.icon">
            <font-awesome-icon :icon="item.icon" />
          </template>
          <template v-else>
            {{ item.title ? t(item.title) : '' }}
          </template>
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
.nav-tabs:deep(.el-menu--horizontal) {
  /*border-bottom: none;*/
}
</style>
