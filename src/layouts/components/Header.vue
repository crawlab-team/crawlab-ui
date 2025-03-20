<script setup lang="ts">
import { computed, ref, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ArrowRight } from '@element-plus/icons-vue';
import {
  setGlobalLang,
  getNavMenuItems,
  isPro,
  getIconByRouteConcept,
  isAllowedRoutePath,
} from '@/utils';
import { getUserFullName } from '@/utils/user';

// i18n
const { t, locale } = useI18n();

// router
const router = useRouter();

const route = useRoute();

// store
const store = useStore();

// store states
const { layout: layoutState, common: commonState } =
  store.state as RootStoreState;

const onClickGitHubStar = () => {
  window.open(`https://www.crawlab.cn/${locale.value}/#pricing`);
};

// set language
const setLang = (lang: Lang) => {
  setGlobalLang(lang);
  store.commit('common/setLang', lang);
};

// current user
const me = computed(() => commonState.me);

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

const navMenuItems = computed<MenuItem[]>(() => getNavMenuItems(route.path));

// Get sidebar visibility from store
const sidebarVisible = computed<boolean>(
  () => layoutState.chatbotSidebarVisible
);

// Ensure the store state is in sync with localStorage
onBeforeMount(() => {
  const storedVisible = localStorage.getItem('chatbotSidebarVisible');
  if (storedVisible === 'true' && !sidebarVisible.value) {
    store.commit('layout/setChatbotSidebarVisible', true);
  }
});

const toggleChatbotSidebar = () => {
  store.commit('layout/setChatbotSidebarVisible', !sidebarVisible.value);
};

defineOptions({ name: 'ClHeader' });
</script>

<template>
  <div class="header-container">
    <el-header height="var(--cl-header-height)" class="header">
      <div class="left">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item to="/">
            <cl-icon :icon="['fa', 'home']" />
          </el-breadcrumb-item>
          <template v-for="item in navMenuItems" :key="item.path">
            <el-breadcrumb-item v-if="item?.path !== '/home'">
              <router-link :to="item.path!">
                <cl-icon
                  :icon="item.icon || getIconByRouteConcept(item.routeConcept!)"
                />
                {{ item.title }}
              </router-link>
            </el-breadcrumb-item>
          </template>
        </el-breadcrumb>
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
        <div class="item">
          <el-tooltip :content="t('global.docs')">
            <el-link
              :href="`https://docs.crawlab.cn/${locale}/`"
              target="_blank"
            >
              <cl-icon :icon="['fa', 'file-alt']" size="normal" />
            </el-link>
          </el-tooltip>
        </div>
        <div class="item action">
          <el-dropdown trigger="click">
            <div class="lang">
              <el-tooltip :content="t('global.locale')">
                <div class="label">
                  <cl-icon :icon="['fa', 'language']" size="normal" />
                  <span v-if="locale === 'zh'"> 中文 </span>
                  <span v-else> EN </span>
                </div>
              </el-tooltip>
            </div>
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
        </div>
        <div v-if="me" class="item action">
          <el-dropdown trigger="click" popper-class="me-dropdown">
            <div class="me">
              <el-tooltip>
                <cl-user-avatar :user="me" />
                <template #content>
                  <div>
                    <label>{{ t('components.user.form.username') }}: </label>
                    <span>{{ me.username }}</span>
                  </div>
                  <div v-if="getUserFullName(me)">
                    <label>{{ t('components.user.form.fullName') }}: </label>
                    <span>{{ getUserFullName(me) }}</span>
                  </div>
                  <div v-if="me.email">
                    <label>{{ t('components.user.form.email') }}: </label>
                    <span>{{ me.email }}</span>
                  </div>
                </template>
              </el-tooltip>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-if="isAllowedRoutePath('/misc/my-account')"
                  @click="() => router.push('/misc/my-account')"
                >
                  <cl-icon :icon="['fa', 'user-cog']" />
                  {{ t('layouts.components.header.myAccount') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="isAllowedRoutePath('/misc/pat')"
                  @click="() => router.push('/misc/pat')"
                >
                  <cl-icon :icon="['fa', 'key']" />
                  {{ t('layouts.components.header.pat') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="isAllowedRoutePath('/misc/disclaimer')"
                  @click="() => router.push('/misc/disclaimer')"
                >
                  <cl-icon :icon="['fa', 'info-circle']" />
                  {{ t('layouts.components.header.disclaimer') }}
                </el-dropdown-item>
                <el-dropdown-item @click="onLogout">
                  <cl-icon :icon="['fa', 'sign-out-alt']" />
                  {{ t('layouts.components.header.logout') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="item action" v-if="!sidebarVisible">
          <el-button
            type="primary"
            @click="toggleChatbotSidebar"
            class="chat-toggle-btn"
          >
            <cl-icon :icon="['fa', 'comment-dots']" />
            <span class="button-text">{{
              t('components.ai.chatbot.button')
            }}</span>
            <cl-icon :icon="['fa', 'angles-left']" class="toggle-indicator" />
          </el-button>
        </div>
      </div>
    </el-header>
  </div>
</template>

<style scoped>
.header-container {
  height: var(--cl-header-height);
  width: 100%;
  background-color: var(--cl-header-bg);
  transition: all 0.3s ease;
  border-bottom: 1px solid var(--el-border-color-light);
  z-index: 1;

  &:deep(.button-wrapper) {
    margin-right: 0;
  }

  .header {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-left: none;

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

        .lang {
          display: flex;
          align-items: center;

          &:hover {
            color: var(--cl-primary-color);
          }

          &:deep(.icon) {
            margin-right: 5px;
          }
        }

        .chat-toggle-btn {
          display: flex;
          align-items: center;
          border-radius: 20px;
          padding: 8px 16px;
          animation: fadeIn 0.3s ease-in-out;
          background-color: var(--el-color-primary-dark-2);

          .button-text {
            margin: 0 8px;
            display: inline-block;
          }

          .toggle-indicator {
            margin-left: 4px;
            transition: transform 0.3s;
          }

          .robot-icon-badge {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
<style>
.me-dropdown {
  .icon {
    width: 20px;
    margin-right: 5px;
  }
}
</style>
