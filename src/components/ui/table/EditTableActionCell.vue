<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TooltipTriggerType } from 'element-plus/es/components/tooltip/src/trigger';
import type { Placement } from '@popperjs/core';
import { translate } from '@/utils';
import type { ContextMenuItem } from '@/components/ui/context-menu/types';

withDefaults(
  defineProps<{
    trigger?: TooltipTriggerType;
    placement?: Placement;
    deleted?: boolean;
  }>(),
  {
    trigger: 'click',
    placement: 'right',
  }
);

const emit = defineEmits<{
  (e: 'add-before'): void;
  (e: 'add-after'): void;
  (e: 'delete'): void;
  (e: 'revert'): void;
}>();

const t = translate;

const contextMenuVisible = ref(false);

const items = computed<ContextMenuItem[]>(() => [
  {
    title: t('common.actions.insertBefore'),
    icon: ['fa', 'arrows-up-to-line'],
    action: () => {
      emit('add-before');
    },
  },
  {
    title: t('common.actions.insertAfter'),
    icon: ['fa', 'arrows-down-to-line'],
    action: () => {
      emit('add-after');
    },
  },
]);

defineOptions({ name: 'ClEditTableActionCell' });
</script>

<template>
  <div class="actions">
    <cl-context-menu
      :visible="contextMenuVisible"
      :trigger="trigger"
      placement="right"
    >
      <template #reference>
        <cl-icon
          :icon="['fa', 'plus']"
          @click.stop="contextMenuVisible = true"
        />
        <cl-icon
          v-if="!deleted"
          :icon="['fa', 'minus']"
          @click="emit('delete')"
        />
        <cl-icon v-else :icon="['fa', 'rotate-left']" @click="emit('revert')" />
      </template>
      <cl-context-menu-list :items="items" @hide="contextMenuVisible = false" />
    </cl-context-menu>
  </div>
</template>
