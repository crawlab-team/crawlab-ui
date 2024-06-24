<script setup lang="ts">
defineOptions({ name: 'ClTime' });
import { computed } from 'vue';
import TimeAgo, { LocaleData } from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import zh from 'javascript-time-ago/locale/zh';
import dayjs from 'dayjs';
import { getI18n } from '@/i18n';

TimeAgo.addLocale(en as LocaleData);
TimeAgo.addLocale(zh as LocaleData);

const props = withDefaults(
  defineProps<{
    time: Date | string;
    ago: boolean;
    format: string;
  }>(),
  {
    time: () => new Date(),
    ago: true,
    format: 'YYYY-MM-DD HH:mm:ssZ',
  }
);

const label = computed<string | undefined>(() => {
  const { time, ago, format } = props;
  if (!time) return;

  if (ago) {
    const timeAgo = new TimeAgo(
      getI18n().global.locale.value === 'zh' ? 'zh' : 'en'
    );
    return timeAgo.format(new Date(time)) as string;
  } else {
    return dayjs(time).format(format);
  }
});
</script>

<template>
  <div class="time">
    {{ label }}
  </div>
</template>

<style lang="scss" scoped></style>
