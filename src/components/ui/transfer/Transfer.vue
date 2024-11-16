<script setup lang="ts">
import { computed, ref } from 'vue';
import { translate } from '@/utils';

const props = defineProps<{
  value: string[];
  data: DraggableItemData[];
  titles?: string[];
  buttonTexts?: string[];
  buttonTooltips?: string[];
}>();

const emit = defineEmits<{
  (e: 'change', value: string[]): void;
}>();

// i18n
const t = translate;

const dataMap = computed<DataMap>(() => {
  const { data } = props as TransferProps;
  const map = {} as DataMap;
  data.forEach(d => {
    map[d.key] = d;
  });
  return map;
});

const leftChecked = ref<string[]>([]);
const leftData = computed<DraggableItemData[]>(() => {
  const { value, data } = props as TransferProps;
  return data.filter(d => !value.includes(d.key));
});
const leftTooltip = computed<string>(() => {
  const { buttonTooltips } = props as TransferProps;
  return buttonTooltips[0];
});
const onLeftCheck = (value: string[]) => {
  leftChecked.value = value;
};

const rightChecked = ref<string[]>([]);
const rightData = computed<DraggableItemData[]>(() => {
  const { value } = props as TransferProps;
  return value.map(key => dataMap.value[key]);
});
const rightTooltip = computed<string>(() => {
  const { buttonTooltips } = props as TransferProps;
  return buttonTooltips[1];
});
const onRightCheck = (value: string[]) => {
  rightChecked.value = value;
};

const leftDisabled = computed<boolean>(() => rightChecked.value.length === 0);
const rightDisabled = computed<boolean>(() => leftChecked.value.length === 0);

const change = (value: string[]) => {
  emit('change', value);
};

const onLeftMove = () => {
  const { value } = props as TransferProps;
  const newValue = value.filter(d => !rightChecked.value.includes(d));
  change(newValue);
  rightChecked.value = [];
};
const onLeftDrag = (items: DraggableItemData[]) => {
  const { value } = props as TransferProps;
  const itemKey = items.map(d => d.key);
  const newValue = value.filter(d => !itemKey.includes(d));
  change(newValue);
};

const onRightMove = () => {
  const { value } = props as TransferProps;
  const newValue = value.concat(leftChecked.value);
  change(newValue);
  leftChecked.value = [];
};
const onRightDrag = (items: DraggableItemData[]) => {
  const newValue = items.map(d => d.key);
  change(newValue);
};
defineOptions({ name: 'ClTransfer' });
</script>

<template>
  <div class="transfer">
    <cl-transfer-panel
      :checked="leftChecked"
      :data="leftData"
      :title="titles?.[0]"
      class="transfer-panel-left"
      @check="onLeftCheck"
      @drag="onLeftDrag"
    />
    <div class="actions">
      <cl-button
        :disabled="leftDisabled"
        :tooltip="leftTooltip || t('components.transfer.moveToLeft')"
        size="large"
        @click="onLeftMove"
      >
        <div class="btn-content">
          <font-awesome-icon
            :icon="['fa', 'angle-left']"
            style="margin-right: 5px"
          />
          {{ buttonTexts?.[0] }}
        </div>
      </cl-button>
      <cl-button
        :disabled="rightDisabled"
        :tooltip="rightTooltip || t('components.transfer.moveToLeft')"
        size="large"
        @click="onRightMove"
      >
        <div class="btn-content">
          {{ buttonTexts?.[1] }}
          <font-awesome-icon
            :icon="['fa', 'angle-right']"
            style="margin-left: 5px"
          />
        </div>
      </cl-button>
    </div>
    <cl-transfer-panel
      :checked="rightChecked"
      :data="rightData"
      :title="titles?.[1]"
      class="transfer-panel-right"
      @check="onRightCheck"
      @drag="onRightDrag"
    />
  </div>
</template>

<style scoped>
.transfer {
  width: 100%;
  min-height: 480px;
  display: flex;
  align-items: center;

  .actions {
    display: flex;
    align-items: center;

    .button {
      .btn-content {
        display: flex;
        align-items: center;
      }
    }
  }

  &:deep(.button-wrapper) {
    margin: 0 10px;
  }
}
</style>
