<script setup lang="ts">
import { translate } from '@/utils';

const t = translate;

defineOptions({ name: 'ClGitHubStarBadge' });
</script>

<template>
  <el-tooltip :content="t('global.github.star')">
    <div class="github-star-badge">
      <a
        class="github-button"
        href="https://github.com/crawlab-team/crawlab"
        target="_blank"
      >
        <img
          src="https://img.shields.io/github/stars/crawlab-team/crawlab?style=social&label=Crawlab"
          alt="GitHub stars"
        />
      </a>
    </div>
  </el-tooltip>
</template>

<style scoped>
.github-star-badge {
  height: 24px;

  .github-button {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      height: 100%;
    }
  }
}
</style>
