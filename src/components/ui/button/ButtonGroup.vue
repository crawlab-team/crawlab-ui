<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ButtonGroupProps } from './types';

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  size: 'small',
  type: 'primary',
  dropdownTrigger: 'click',
});

// Compute display buttons with proper component mapping
const displayButtons = computed(() => {
  return props.buttons?.map(btn => ({
    ...btn,
    // Set component type based on buttonType
    component:
      btn.buttonType === 'fa-icon'
        ? 'cl-fa-icon-button'
        : btn.buttonType === 'icon'
          ? 'cl-icon-button'
          : btn.buttonType === 'label'
            ? 'cl-label-button'
            : 'cl-button',
  }));
});

const visible = ref(false);

const onDropdownClick = (event: Event) => {
  event.stopPropagation();
  if (props.dropdownTrigger === 'click') {
    visible.value = !visible.value;
  }
};

defineOptions({ name: 'ClButtonGroup' });
</script>

<template>
  <el-button-group :type="type" :size="size">
    <component
      v-for="(btn, $index) in displayButtons"
      :key="$index"
      :is="btn.component"
      v-bind="btn"
      :size="size"
      :type="btn.type || type"
    />
    <cl-context-menu
      v-if="dropdownItems?.length"
      :visible="visible"
      :trigger="dropdownTrigger"
      placement="bottom-start"
    >
      <template #reference>
        <div class="el-button show-more">
          <cl-fa-icon-button
            :icon="['fa', 'ellipsis-v']"
            :size="size"
            @click="onDropdownClick"
          />
        </div>
      </template>
      <cl-context-menu-list
        :items="dropdownItems"
        @hide="() => (visible = false)"
      />
    </cl-context-menu>
  </el-button-group>
</template>

<style scoped>
.el-button-group {
  &:deep(.show-more) {
    float: none;
    margin: 0;
    padding: 0;
    border: none;
    height: inherit;
    vertical-align: unset;
  }

  &:deep(.show-more > .el-button) {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
}
</style>
