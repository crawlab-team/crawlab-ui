<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ArrowDown, ArrowRight } from '@element-plus/icons-vue';
import { setGlobalLang, getNavMenuItems, isPro } from '@/utils';

// i18n
const { t, locale } = useI18n();

// router
const router = useRouter();

const route = useRoute();

// store
const store = useStore();

// store states
const { layout: layoutState } = store.state as RootStoreState;

// whether side is collapsed
const sidebarCollapsed = computed(() => {
  return layoutState.sidebarCollapsed;
});

const onClickGitHubStar = () => {
  window.open(`https://www.crawlab.cn/${locale.value}/#pricing`);
};

// language name
const langName = computed<string>(() => {
  return t('global.lang', [], { locale: locale.value });
});

// set language
const setLang = (lang: Lang) => {
  setGlobalLang(lang);
  store.commit('common/setLang', lang);
};

// current user's username
const username = computed<string | undefined>(() => {
  const me = store.getters['user/me'] as User | undefined;
  if (!me) return;
  return me.username;
});

// on logout hook
const onLogout = () => {
  setTimeout(() => {
    // clear token
    localStorage.removeItem('token');

    // clear me
    store.commit('user/resetMe');

    // navigate to login page
    router.push('/login');
  }, 10);
};

// on click disclaimer
const onClickDisclaimer = () => {
  router.push('/misc/disclaimer');
};

// on click my settings
const onClickMySettings = () => {
  router.push('/misc/my-settings');
};

const navMenuItems = computed<MenuItem[]>(() => getNavMenuItems(route.path));

defineOptions({ name: 'ClHeader' });
</script>

<template>
  <div :class="sidebarCollapsed ? 'collapsed' : ''" class="header-container">
    <el-header height="var(--cl-header-height)" class="header">
      <div class="left">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item to="/">
            <cl-icon :icon="['fa', 'home']" />
          </el-breadcrumb-item>
          <template v-for="item in navMenuItems" :key="item.path">
            <el-breadcrumb-item v-if="item?.path !== '/home'">
              <router-link :to="item.path">
                <cl-icon :icon="item.icon" />
                {{ item.title }}
              </router-link>
            </el-breadcrumb-item>
          </template>
        </el-breadcrumb>

        <cl-tabs-view v-if="false" />
      </div>
      <div class="right">
        <template v-if="!isPro()">
          <div class="item">
            <cl-label-button
              class-name="item"
              :icon="['fa', 'arrow-up']"
              size="small"
              type="warning"
              :label="t('global.upgrade.pro.label')"
              :tooltip="t('global.upgrade.pro.tooltip')"
              @click="onClickGitHubStar"
            />
          </div>
          <div class="item">
            <cl-git-hub-star-badge />
          </div>
        </template>
        <el-link
          class="item"
          :href="`https://docs.crawlab.cn/${locale}/`"
          target="_blank"
        >
          <font-awesome-icon class="icon" :icon="['fa', 'book']" />
          {{ t('global.docs') }}
        </el-link>
        <el-dropdown class="lang">
          <span class="el-dropdown-link item action">
            <font-awesome-icon class="icon" :icon="['fa', 'globe']" />
            {{ langName }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                :class="locale === 'en' ? 'active' : ''"
                @click="() => setLang('en')"
              >
                {{ t('global.lang', [], { locale: 'en' }) }}
              </el-dropdown-item>
              <el-dropdown-item
                :class="locale === 'zh' ? 'active' : ''"
                @click="() => setLang('zh')"
              >
                {{ t('global.lang', [], { locale: 'zh' }) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown v-locate="'me'" class="me">
          <span class="el-dropdown-link item action">
            <font-awesome-icon class="icon" :icon="['far', 'user']" />
            {{ username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="onClickDisclaimer">
                {{ t('layouts.components.header.disclaimer') }}
              </el-dropdown-item>
              <el-dropdown-item @click="onClickMySettings">
                {{ t('layouts.components.header.mySettings') }}
              </el-dropdown-item>
              <el-dropdown-item @click="onLogout">
                <span v-locate="'logout'">{{
                  t('layouts.components.header.logout')
                }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
  </div>
</template>

<style lang="scss" scoped>
.header-container {
  height: var(--cl-header-height);
  width: calc(100vw - var(--cl-sidebar-width));
  background-color: var(--cl-header-bg);
  transition: width var(--cl-sidebar-collapse-transition-duration);

  &.collapsed {
    width: calc(100vw - var(--cl-sidebar-width-collapsed));
  }

  .header {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-left: none;
    border-bottom: 1px solid var(--cl-header-border-color);

    .left {
      display: flex;
      align-items: center;
    }

    .right {
      display: flex;
      align-items: center;

      .item {
        margin-left: 20px;
        display: flex;
        align-items: center;

        &.action {
          cursor: pointer;
        }

        &:focus-visible {
          outline: none;
        }

        .icon {
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
<style scoped>
.header-container:deep(.button-wrapper) {
  margin-right: 0;
}
</style>
