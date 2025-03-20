<script setup lang="ts">
import { computed } from 'vue';
import markdownit from 'markdown-it';
import { translate } from '@/utils';

// i18n
const t = translate;

// markdown-to-text converter
const md = new markdownit();

// title
const title = computed<string>(() => t('views.misc.disclaimer.title'));

// content
const content = computed<string>(() => {
  return md.render(t('views.misc.disclaimer.content'));
});
defineOptions({ name: 'ClDisclaimer' });
</script>

<template>
  <cl-simple-layout>
    <div class="disclaimer">
      <div class="container">
        <h1 class="title">
          {{ title }}
        </h1>
        <div class="content" v-html="content" />
      </div>
    </div>
  </cl-simple-layout>
</template>

<style scoped>
.disclaimer {
  min-height: 100%;
  padding: 0 calc((100% - 800px) / 2);
  color: var(--cl-info-color);

  .container {
    .content {
      font-size: 18px;
      line-height: 1.6;
    }
  }
}
</style>
