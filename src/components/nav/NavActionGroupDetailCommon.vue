<script setup lang="ts">
defineOptions({ name: 'ClNavActionGroupDetailCommon' });
import { ACTION_BACK, ACTION_SAVE } from '@/constants';
import { translate } from '@/utils';

const props = withDefaults(
  defineProps<{
    disabled: boolean;
    showBackButton: boolean;
    showSaveButton: boolean;
  }>(),
  {
    disabled: false,
    showBackButton: true,
    showSaveButton: true,
  }
);

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'save'): void;
}>();

const t = translate;
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-item v-if="showBackButton">
      <cl-nav-action-button
        v-auth="ACTION_BACK"
        :disabled="disabled"
        :icon="['fa', 'undo']"
        button-type="label"
        :label="t('components.nav.actions.back')"
        type="primary"
        id="back-btn"
        class-name="back-btn"
        @click="() => emit('back')"
      />
    </cl-nav-action-item>
    <cl-nav-action-item v-if="showSaveButton">
      <cl-nav-action-button
        v-auth="ACTION_SAVE"
        :disabled="disabled"
        :icon="['fa', 'save']"
        button-type="label"
        :label="t('components.nav.actions.save')"
        type="success"
        id="save-btn"
        class-name="save-btn"
        @click="() => emit('save')"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
</template>

<style lang="scss" scoped></style>
