<script setup lang="ts">
import { compare, valid, coerce } from 'semver';
import { getIconByAction, translate } from '@/utils';
import { ACTION_INSTALL, ACTION_UPGRADE } from '@/constants';
import { computed } from 'vue';

const t = translate;

const props = defineProps<{
  repo: DependencyRepo;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

// Helper to safely compare versions
const isOutdated = (version: string) => {
  const { repo } = props;

  // Validate both versions first
  const validCurrent = valid(coerce(version));
  const validLatest = repo.latest_version && valid(coerce(repo.latest_version));
  console.debug(validCurrent, validLatest, repo.latest_version);

  if (!validCurrent || !validLatest) return false;
  return compare(validCurrent, validLatest) < 0;
};

const isUninstalled = (version: string) => !version || version === 'N/A';

const onClick = (version: string) => {
  if (!isOutdated(version) && !isUninstalled(version)) {
    return;
  }
  emit('click');
};

const getTagProps = (version: string) => {
  const { repo } = props;
  if (isUninstalled(version)) {
    return {
      icon: getIconByAction(ACTION_INSTALL),
      type: 'info',
      label: repo.latest_version,
      tooltip: `${t('common.actions.install')} ${repo.name} (${repo.latest_version})`,
      clickable: repo.latest_version,
    };
  }
  if (isOutdated(version)) {
    return {
      icon: getIconByAction(ACTION_UPGRADE),
      type: 'warning',
      label: `${version} → ${repo.latest_version}`,
      tooltip: `${t('common.actions.upgrade')} ${repo.name} (${version} → ${repo.latest_version})`,
      clickable: true,
    };
  }
  return {
    icon: ['fa', 'check'],
    type: 'success',
    label: version,
    tooltip: t('common.status.alreadyUpToDate'),
    clickable: false,
  };
};

const versions = computed(() => {
  const { repo } = props;
  const versions = new Set<string>();
  repo.dependencies?.forEach(dep => {
    if (!dep.version) return;
    console.debug(dep.version);
    versions.add(dep.version);
  });
  return versions;
});

defineOptions({ name: 'ClDependencyVersions' });
</script>

<template>
  <div class="dependency-versions">
    <cl-tag
      v-for="(version, $index) in versions"
      :key="$index"
      :icon="getTagProps(version).icon"
      :type="getTagProps(version).type"
      :label="getTagProps(version).label"
      :tooltip="getTagProps(version).tooltip"
      :clickable="getTagProps(version).clickable"
      short
      @click="onClick(version)"
    />
  </div>
</template>

<style scoped>
.dependency-versions {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
