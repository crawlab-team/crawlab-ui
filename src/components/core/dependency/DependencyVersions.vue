<script setup lang="ts">
import { compare, valid } from 'semver';
import { getIconByAction, translate } from '@/utils';
import { ACTION_INSTALL, ACTION_UPGRADE } from '@/constants';

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
  const validCurrent = valid(version);
  const validLatest = repo.latest_version && valid(repo.latest_version);

  if (!validCurrent || !validLatest) return false;
  return compare(version, repo.latest_version!) < 0;
};

const isUninstalled = (version: string) => version === 'N/A';

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
      type: 'danger',
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

defineOptions({ name: 'ClDependencyVersions' });
</script>

<template>
  <div class="dependency-versions">
    <cl-tag
      v-for="version in repo.versions"
      :key="version"
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
