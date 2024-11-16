<script setup lang="ts">
import { computed } from 'vue';
import {
  DATA_FIELD_TYPE_GENERAL,
  DATA_FIELD_TYPE_IMAGE,
  DATA_FIELD_TYPE_URL,
  DATA_FIELD_TYPE_HTML,
  DATA_FIELD_TYPE_LONG_TEXT,
  DATA_FIELD_TYPE_TIME,
} from '@/constants/dataFields';
import { formatTimeAgo, translate } from '@/utils';
import { useStore } from 'vuex';
import dayjs from 'dayjs';

const props = withDefaults(
  defineProps<{
    fieldKey?: string;
    type: DataFieldType;
    value?: string | number | boolean | Array<any> | Record<string, any>;
  }>(),
  {
    type: DATA_FIELD_TYPE_GENERAL,
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const t = translate;

// store
const ns = 'dataCollection';
const store = useStore();

// tooltip
const tooltipValue = computed<string>(() => {
  const { type, value } = props;
  switch (type) {
    case DATA_FIELD_TYPE_LONG_TEXT:
      if (typeof value !== 'string') return '';
      return value.substring(0, 200) + '...';
    case DATA_FIELD_TYPE_TIME:
      if (typeof value !== 'string' && typeof value !== 'number') return '';
      const ago = formatTimeAgo(
        typeof value === 'string' ? value : value.toString()
      );
      const time = dayjs(value);
      return `${time.format('YYYY-MM-DD HH:mm:ssZ')} (${ago})`;
    default:
      return typeof value === 'string' ? value : JSON.stringify(value);
  }
});
const tooltip = computed<string>(() => {
  return `
<label style="margin-right: 5px;">${t('components.result.form.dataType')}:</label>
<div style="color:var(--cl-primary-color);font-weight:600;display:inline-block;max-width:800px;">${t('components.result.types.' + props.type)}</div><br> ${tooltipValue.value}`;
});

const onClick = async () => {
  emit('click');
  const { type, value, fieldKey } = props;
  switch (type) {
    case DATA_FIELD_TYPE_LONG_TEXT:
    case DATA_FIELD_TYPE_HTML:
      store.commit(`${ns}/setResultDialogVisible`, true);
      store.commit(`${ns}/setResultDialogContent`, value);
      store.commit(`${ns}/setResultDialogType`, type);
      store.commit(`${ns}/setResultDialogKey`, fieldKey);
  }
};

const cls = computed<string>(() => {
  const { type } = props;
  const cls = [];
  if (type) {
    cls.push(type);
  }
  return cls.join(' ');
});
defineOptions({ name: 'ClResultCell' });
</script>

<template>
  <el-tooltip>
    <!--tooltip-->
    <template #content>
      <div v-html="tooltip" />
    </template>
    <!--./tooltip-->

    <!--content-->
    <div class="result-cell" :class="cls" @click="onClick">
      <template v-if="type === DATA_FIELD_TYPE_IMAGE">
        <a class="result-cell-image" :href="value?.toString()" target="_blank">
          <img :src="value?.toString()" :alt="value?.toString()" />
        </a>
      </template>

      <template v-else-if="type === DATA_FIELD_TYPE_URL">
        <div class="result-cell-url">
          <font-awesome-icon class="icon" :icon="['fa', 'link']" />
          <a :href="value?.toString()" target="_blank">
            {{ value }}
          </a>
        </div>
      </template>

      <template v-else-if="type === DATA_FIELD_TYPE_HTML">
        <div v-html="value" />
      </template>

      <template v-else-if="type === DATA_FIELD_TYPE_LONG_TEXT">
        <div class="result-cell-long-text">
          {{ value }}
        </div>
      </template>

      <template v-else>
        {{ value }}
      </template>
    </div>
    <!--./content-->
  </el-tooltip>
</template>

<style scoped>
.result-cell {
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-height: 240px;
  max-width: 240px;

  &.html,
  &.long-text {
    overflow: auto;
    white-space: inherit;
  }

  &:hover {
    text-decoration: underline;
  }

  .icon {
    margin-right: 3px;
  }

  .result-cell-image {
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }

  .result-cell-url {
    color: var(--cl-primary-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .result-cell-long-text {
    overflow-y: auto;
  }
}
</style>
