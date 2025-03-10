<script setup lang="ts">
import { computed } from 'vue';
import { CronExpression, parseExpression } from 'cron-parser';
import cronstrue from 'cronstrue/i18n';
import dayjs from 'dayjs';
import zh from 'dayjs/locale/zh.js';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { getI18n } from '@/i18n';
import { translate } from '@/utils';
import { TagProps } from '@/components/ui/tag/types';

dayjs.extend(localizedFormat);

const props = defineProps<{
  cron?: string;
  size?: BasicSize;
  iconOnly?: boolean;
}>();

// i18n
const t = translate;

const isValid = computed((): boolean => {
  const { cron } = props;
  if (!cron) return false;
  try {
    parseExpression(cron);
  } catch (e) {
    return false;
  }
  try {
    cronstrue.toString(cron);
  } catch (e) {
    return false;
  }
  return true;
});

const interval = computed<CronExpression | undefined>(() => {
  const { cron } = props;
  if (!cron) return;
  try {
    return parseExpression(cron);
  } catch (e) {
    return;
  }
});

const next = computed<string | undefined>(() => {
  if (!interval.value || !isValid.value) {
    return t('common.status.unknown');
  }
  if (getI18n().global.locale.value === 'zh') {
    return dayjs(interval.value.next().getTime())?.locale(zh)?.format('llll');
  } else {
    return dayjs(interval.value.next().getTime())?.format('llll');
  }
});

const description = computed<string | undefined>(() => {
  const { cron } = props;
  if (!cron) return;
  try {
    return cronstrue.toString(cron, {
      locale: getI18n().global.locale.value === 'zh' ? 'zh_CN' : 'en',
    });
  } catch (e) {
    return t('components.schedule.rules.message.invalidCronExpression');
  }
});

const tooltip = computed<string>(
  () => `<span class="title">${t('components.schedule.cron.title.cron')}: </span><span style="color: var(--cl-blue)">${props.cron}</span><br>
<span class="title">${t('components.schedule.cron.title.description')}: </span><span style="color: var(--cl-orange)">${description.value}</span><br>
<span class="title">${t('components.schedule.cron.title.next')}: </span><span style="color: var(--cl-green)">${next.value}</span>`
);

const data = computed<TagProps>(() => {
  const { cron } = props;
  if (!isValid.value) {
    return {
      label: t('common.status.unknown'),
      tooltip: t('common.status.unknown'),
      type: 'info',
    };
  }

  return {
    label: cron,
    tooltip: tooltip.value,
    type: 'primary',
  };
});
defineOptions({ name: 'ClScheduleCron' });
</script>

<template>
  <cl-tag
    v-if="!iconOnly"
    :key="data"
    :icon="data.icon"
    :label="data.label"
    :size="size"
    :spinning="data.spinning"
    :type="data.type"
    class="schedule-cron"
    @click="$emit('click')"
  >
    <template #tooltip>
      <div v-html="data.tooltip" />
    </template>
  </cl-tag>
  <div v-else :class="[isValid ? 'valid' : 'invalid']" class="schedule-cron">
    <div class="row">
      <span class="title">
        <el-tooltip
          :content="t('components.schedule.cron.title.cronDescription')"
        >
          <font-awesome-icon
            :icon="['fa', 'info-circle']"
            class="description"
          />
        </el-tooltip>
      </span>
      <span class="value description">
        {{ isValid ? description : t('common.status.invalid') }}
      </span>
    </div>
    <div class="row">
      <span class="title">
        <el-tooltip :content="t('components.schedule.cron.title.nextRun')">
          <font-awesome-icon :icon="['fa', 'arrow-right']" class="next" />
        </el-tooltip>
      </span>
      <span class="value next">
        {{ isValid ? next : t('common.status.invalid') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.schedule-cron {
  .row {
    min-height: 20px;

    .title {
      display: inline-block;
      width: 18px;
      text-align: right;
      font-size: 14px;
      margin-right: 10px;
    }

    .value {
      font-size: 14px;
    }

    .description {
      color: var(--cl-warning-color);
    }

    .next {
      color: var(--cl-success-color);
    }
  }

  &.invalid {
    .description,
    .next {
      color: var(--cl-info-medium-color);
    }
  }
}
</style>
