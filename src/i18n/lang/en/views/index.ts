import login from './login';
import home from './home';
import nodes from './nodes';
import projects from './projects';
import spiders from './spiders';
import schedules from './schedules';
import tasks from './tasks';
import gits from './gits';
import database from './database';
import users from './users';
import roles from './roles';
import tags from './tags';
import tokens from './tokens';
import env from './env';
import notification from './notification';
import environment from './environment';
import llm from './llm';
import system from './system';
import misc from './misc';

const views: LViews = {
  login,
  home,
  nodes,
  projects,
  spiders,
  schedules,
  tasks,
  gits,
  database,
  users,
  roles,
  tags,
  tokens,
  env,
  notification,
  environment,
  llm,
  system,
  misc,
};
export default views;
