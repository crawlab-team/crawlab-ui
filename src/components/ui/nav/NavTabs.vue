<script setup lang="ts">
import { getIconByNavItem, translate } from '@/utils';

const t = translate;

defineProps<{
  items?: NavItem[];
  activeKey?: string;
}>();

const emit = defineEmits<{
  (e: 'select', index: string): void;
}>();

const onSelect = (index: string) => {
  emit('select', index);
};

const getClassName = (item: NavItem): string => {
  const cls = [];
  if (item.emphasis) cls.push('emphasis');
  if (item.id) cls.push(item.id);
  return cls.join(' ');
};
defineOptions({ name: 'ClNavTabs' });
</script>

<template>
  <div class="nav-tabs">
    <el-menu :default-active="activeKey" mode="horizontal" @select="onSelect">
      <el-menu-item
        v-for="item in items"
        :key="item.id"
        :data-test="item.id"
        :class="getClassName(item)"
        :index="item.id"
        :style="item.style"
        :disabled="item.disabled"
      >
        <el-tooltip :content="item.tooltip" :disabled="!item.tooltip">
          <el-badge
            :value="item.badge || ''"
            :type="item.badgeType"
            :offset="[10, 10]"
          >
            <div class="item-wrapper">
              <cl-icon
                :icon="item.icon ?? getIconByNavItem(item)"
                :spinning="item.iconSpinning"
              />
              <span class="label">{{ t(item.title || '') }}</span>
            </div>
          </el-badge>
        </el-tooltip>
      </el-menu-item>
    </el-menu>
    <div class="extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<style scoped>
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
      color: var(--cl-info-medium-dark-color);

      &:not(.is-disabled):hover {
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

        &:deep(.icon) {
          margin-right: 5px;
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
