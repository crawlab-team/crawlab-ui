<script setup lang="ts">
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { isPro, translate } from '@/utils';
import useSpider from '@/components/core/spider/useSpider';

const router = useRouter();

// i18n
const t = translate;

// store
const ns = 'spider';
const store = useStore();

const { activeDialogKey, form } = useSpider(store);

const onRun = () => {
  store.commit(`${ns}/showDialog`, 'run');
};
defineOptions({ name: 'ClSpiderDetailActionsCommon' });
</script>

<template>
  <cl-nav-action-group>
    <cl-nav-action-fa-icon :icon="['fa', 'tools']" />
    <cl-nav-action-item>
      <cl-fa-icon-button
        :icon="['fa', 'play']"
        :tooltip="t('common.actions.run')"
        type="success"
        @click="onRun"
      />
    </cl-nav-action-item>
  </cl-nav-action-group>
  <cl-nav-action-group v-if="isPro() && form?.git">
    <cl-nav-action-fa-icon :icon="['fab', 'git']" />
    <cl-nav-action-item>
      <div style="margin-right: 10px">
        <cl-tag
          :label="form.git.name"
          :icon="['fa', 'code-branch']"
          :tooltip="`${t('components.spider.form.git')}: ${form.git.name}`"
          size="large"
          clickable
          @click="router.push(`/gits/${form.git._id}`)"
        >
          <template #tooltip>
            <div>
              <label>{{ t('components.spider.form.git') }}: </label>
              <span>{{ form.git.name }}</span>
            </div>
            <div>
              <label>{{ t('components.spider.form.gitRootPath') }}: </label>
              <span>
                <cl-git-path :path="form.git_root_path" />
              </span>
            </div>
          </template>
        </cl-tag>
      </div>
    </cl-nav-action-item>
  </cl-nav-action-group>

  <!-- Dialogs (handled by store) -->
  <cl-run-spider-dialog v-if="activeDialogKey === 'run'" />
  <!-- ./Dialogs -->
</template>


