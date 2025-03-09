import {
  ACTION_ADD,
  ACTION_BACK,
  ACTION_CANCEL,
  ACTION_CLONE,
  ACTION_COPY,
  ACTION_DELETE,
  ACTION_EDIT,
  ACTION_ENABLE,
  ACTION_FILTER,
  ACTION_FILTER_SEARCH,
  ACTION_FILTER_SELECT,
  ACTION_FORCE_CANCEL,
  ACTION_INSTALL,
  ACTION_LINK,
  ACTION_RESTART,
  ACTION_RETRY,
  ACTION_RUN,
  ACTION_SAVE,
  ACTION_SEND_TEST_MESSAGE,
  ACTION_START,
  ACTION_STOP,
  ACTION_UNINSTALL,
  ACTION_UNLINK,
  ACTION_UPGRADE,
  ACTION_UPLOAD_FILES,
  ACTION_VIEW,
  ACTION_VIEW_CHANGES,
  ACTION_VIEW_CHANNELS,
  ACTION_VIEW_COMMITS,
  ACTION_VIEW_CONSOLE,
  ACTION_VIEW_DATA,
  ACTION_VIEW_DATABASES,
  ACTION_VIEW_DEPENDENCIES,
  ACTION_VIEW_FILES,
  ACTION_VIEW_LOGS,
  ACTION_VIEW_MAIL,
  ACTION_VIEW_MONITORING,
  ACTION_VIEW_PAGES,
  ACTION_VIEW_SCHEDULES,
  ACTION_VIEW_SPIDERS,
  ACTION_VIEW_TASKS,
  ACTION_VIEW_TEMPLATE,
  ACTION_VIEW_USERS,
  TAB_NAME_CHANGES,
  TAB_NAME_CHANNELS,
  TAB_NAME_COLUMNS,
  TAB_NAME_COMMITS,
  TAB_NAME_CONSOLE,
  TAB_NAME_DATA,
  TAB_NAME_DATABASES,
  TAB_NAME_DEPENDENCIES,
  TAB_NAME_FILES,
  TAB_NAME_INDEXES,
  TAB_NAME_LOGS,
  TAB_NAME_MAIL,
  TAB_NAME_MONITORING,
  TAB_NAME_OUTPUT,
  TAB_NAME_OVERVIEW,
  TAB_NAME_PAGES,
  TAB_NAME_PERMISSIONS,
  TAB_NAME_RESULTS,
  TAB_NAME_ROLES,
  TAB_NAME_SCHEDULES,
  TAB_NAME_SETTINGS,
  TAB_NAME_SPIDERS,
  TAB_NAME_TABLE,
  TAB_NAME_TASKS,
  TAB_NAME_TEMPLATE,
  TAB_NAME_TRIGGERS,
  TAB_NAME_USERS,
} from '@/constants';

export const getIconByTabName = (tabName: string): Icon => {
  switch (tabName) {
    case TAB_NAME_OVERVIEW:
      return ['fa', 'tachometer-alt'];
    case TAB_NAME_FILES:
      return ['fa', 'file-code'];
    case TAB_NAME_TASKS:
      return ['fa', 'tasks'];
    case TAB_NAME_SETTINGS:
      return ['fa', 'cog'];
    case TAB_NAME_SPIDERS:
      return ['fa', 'spider'];
    case TAB_NAME_DATA:
      return ['fa', 'table'];
    case TAB_NAME_SCHEDULES:
      return ['fa', 'calendar-alt'];
    case TAB_NAME_LOGS:
      return ['fa', 'file-alt'];
    case TAB_NAME_DEPENDENCIES:
      return ['fa', 'cubes'];
    case TAB_NAME_TRIGGERS:
      return ['fa', 'bolt'];
    case TAB_NAME_TEMPLATE:
      return ['fa', 'file-code'];
    case TAB_NAME_CHANGES:
      return ['fa', 'code-commit'];
    case TAB_NAME_COMMITS:
      return ['fa', 'code-branch'];
    case TAB_NAME_MONITORING:
      return ['fa', 'line-chart'];
    case TAB_NAME_CHANNELS:
      return ['fa', 'broadcast-tower'];
    case TAB_NAME_MAIL:
      return ['fa', 'at'];
    case TAB_NAME_DATABASES:
      return ['fa', 'database'];
    case TAB_NAME_CONSOLE:
      return ['fa', 'terminal'];
    case TAB_NAME_TABLE:
      return ['fa', 'table'];
    case TAB_NAME_COLUMNS:
      return ['fa', 'columns'];
    case TAB_NAME_INDEXES:
      return ['fa', 'list-ol'];
    case TAB_NAME_RESULTS:
      return ['fa', 'table'];
    case TAB_NAME_OUTPUT:
      return ['fa', 'file-alt'];
    case TAB_NAME_USERS:
      return ['fa', 'users'];
    case TAB_NAME_ROLES:
      return ['fa', 'user-lock'];
    case TAB_NAME_PERMISSIONS:
      return ['fa', 'user-check'];
    case TAB_NAME_PAGES:
      return ['fa', 'file-alt'];
    default:
      return ['fa', 'circle'];
  }
};

export const getIconByNavItem = (item: NavItem): Icon => {
  return getIconByTabName(item.id);
};

export const getIconByAction = (action: string): Icon | undefined => {
  switch (action) {
    // Basic Actions
    case ACTION_ADD:
      return ['fa', 'plus'];
    case ACTION_VIEW:
      return ['fa', 'search'];
    case ACTION_EDIT:
      return ['fa', 'edit'];
    case ACTION_CLONE:
      return ['fa', 'copy'];
    case ACTION_DELETE:
      return ['fa', 'trash-alt'];
    case ACTION_COPY:
      return ['fa', 'copy'];
    case ACTION_SAVE:
      return ['fa', 'save'];
    case ACTION_BACK:
      return ['fa', 'undo'];

    // Task/Process Actions
    case ACTION_RUN:
      return ['fa', 'play'];
    case ACTION_START:
      return ['fa', 'play'];
    case ACTION_STOP:
      return ['fa', 'stop'];
    case ACTION_CANCEL:
      return ['fa', 'stop'];
    case ACTION_FORCE_CANCEL:
      return ['fa', 'skull-crossbones'];
    case ACTION_RESTART:
      return ['fa', 'redo'];
    case ACTION_ENABLE:
      return ['fa', 'toggle-on'];

    // File Actions
    case ACTION_UPLOAD_FILES:
      return ['fa', 'upload'];

    // View Actions
    case ACTION_VIEW_LOGS:
      return ['fa', 'file-alt'];
    case ACTION_VIEW_FILES:
      return ['fa', 'file-code'];
    case ACTION_VIEW_TASKS:
      return ['fa', 'tasks'];
    case ACTION_VIEW_SCHEDULES:
      return ['fa', 'calendar-alt'];
    case ACTION_VIEW_DATA:
      return ['fa', 'table'];
    case ACTION_VIEW_MONITORING:
      return ['fa', 'chart-line'];
    case ACTION_VIEW_SPIDERS:
      return ['fa', 'spider'];
    case ACTION_VIEW_CHANGES:
      return ['fa', 'code-commit'];
    case ACTION_VIEW_COMMITS:
      return ['fa', 'code-branch'];
    case ACTION_VIEW_DATABASES:
      return ['fa', 'database'];
    case ACTION_VIEW_CONSOLE:
      return ['fa', 'terminal'];
    case ACTION_VIEW_PAGES:
      return ['fa', 'file-alt'];
    case ACTION_VIEW_USERS:
      return ['fa', 'users'];
    case ACTION_VIEW_MAIL:
      return ['fa', 'at'];
    case ACTION_VIEW_TEMPLATE:
      return ['fa', 'file-code'];
    case ACTION_VIEW_CHANNELS:
      return ['fa', 'broadcast-tower'];
    case ACTION_VIEW_DEPENDENCIES:
      return ['fa', 'cubes'];

    // Filter Actions
    case ACTION_FILTER:
      return ['fa', 'filter'];
    case ACTION_FILTER_SEARCH:
      return ['fa', 'search'];
    case ACTION_FILTER_SELECT:
      return ['fa', 'check-square'];

    // Link Actions
    case ACTION_LINK:
      return ['fa', 'link'];
    case ACTION_UNLINK:
      return ['fa', 'unlink'];

    // Dependency Actions
    case ACTION_INSTALL:
      return ['fa', 'download'];
    case ACTION_UNINSTALL:
      return ['fa', 'trash-alt'];
    case ACTION_UPGRADE:
      return ['fa', 'arrow-up'];

    // Notification Actions
    case ACTION_SEND_TEST_MESSAGE:
      return ['fa', 'paper-plane'];

    // Git Actions
    case ACTION_RETRY:
      return ['fa', 'redo'];

    // Default
    default:
      return;
  }
};

export const getIconByRouteConcept = (concept: RouteConcept): Icon => {
  switch (concept) {
    case 'node':
      return ['fa', 'server'];
    case 'project':
      return ['fa', 'project-diagram'];
    case 'spider':
      return ['fa', 'spider'];
    case 'task':
      return ['fa', 'tasks'];
    case 'schedule':
      return ['fa', 'clock'];
    case 'user':
      return ['fa', 'users'];
    case 'role':
      return ['fa', 'user-tag'];
    case 'token':
      return ['fa', 'key'];
    case 'git':
      return ['fab', 'git'];
    case 'notification':
      return ['fa', 'envelope'];
    case 'notificationSetting':
      return ['fa', 'cog'];
    case 'notificationChannel':
      return ['fa', 'broadcast-tower'];
    case 'notificationRequest':
      return ['fa', 'paper-plane'];
    case 'notificationAlert':
      return ['fa', 'bell'];
    case 'database':
      return ['fa', 'database'];
    case 'dependency':
      return ['fa', 'cubes'];
    case 'environment':
      return ['fa', 'code'];
    case 'home':
      return ['fa', 'home'];
    case 'permission':
      return ['fa', 'user-check'];
    case 'ai':
      return ['fa', 'comment-dots'];
    case 'system':
      return ['fa', 'cogs'];
    case 'myAccount':
      return ['fa', 'user-cog'];
    case 'pat':
      return ['fa', 'key'];
    case 'disclaimer':
      return ['fa', 'info-circle'];
    default:
      return ['fa', 'circle'];
  }
};

export const getIconByGeneralConcept = (concept: GeneralConcept): Icon => {
  switch (concept) {
    case 'customize':
      return ['fa', 'palette'];
    default:
      return ['fa', 'circle'];
  }
};
