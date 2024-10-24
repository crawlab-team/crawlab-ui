<script setup lang="ts">
import { computed } from 'vue';
import TimeAgo, { LocaleData } from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import zh from 'javascript-time-ago/locale/zh';
import dayjs from 'dayjs';
import { formatTimeAgo } from '@/utils';

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
    return formatTimeAgo(time);
  } else {
    return dayjs(time).format(format);
  }
});
defineOptions({ name: 'ClTime' });
</script>

<template>
  <div class="time">
    {{ label }}
  </div>
</template>


