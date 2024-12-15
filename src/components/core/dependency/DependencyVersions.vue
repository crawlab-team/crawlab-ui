<script setup lang="ts">
import { compare, valid, coerce } from 'semver';
import { getIconByAction, translate } from '@/utils';
import { ACTION_INSTALL, ACTION_UPGRADE } from '@/constants';
import { computed } from 'vue';

const t = translate;

const props = defineProps<{
  name: string;
  dependencies: Dependency[];
  latestVersion?: string;
  requiredVersion?: string;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

// Helper to safely compare versions
const isOutdated = (version: string) => {
  const { requiredVersion, latestVersion } = props;

  const _requiredVersion = requiredVersion || latestVersion;

  // Validate both versions first
  const validCurrent = valid(coerce(version));
  const validLatest = _requiredVersion && valid(coerce(_requiredVersion));

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
  const { name, latestVersion } = props;
  if (isUninstalled(version)) {
    return {
      icon: getIconByAction(ACTION_INSTALL),
      type: 'info',
      label: latestVersion,
      tooltip: `${t('common.actions.install')} ${name} (${latestVersion})`,
      clickable: latestVersion,
    };
  }
  if (isOutdated(version)) {
    return {
      icon: getIconByAction(ACTION_UPGRADE),
      type: 'warning',
      label: `${version} → ${latestVersion}`,
      tooltip: `${t('common.actions.upgrade')} ${name} (${version} → ${latestVersion})`,
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
  const { dependencies } = props;
  const versions = new Set<string>();
  dependencies?.forEach(dep => {
    if (!dep.version) return;
    versions.add(dep.version);
  });
  return versions;
});

defineOptions({ name: 'ClDependencyVersions' });
</script>

<template>
  <div v-memo="[name]" class="dependency-versions">
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
