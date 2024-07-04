import { ComponentOptionsMixin, Plugin } from 'vue';
import 'normalize.css/normalize.css';
import 'element-plus/theme-chalk/index.css';
import '@/styles/index.scss';
declare const makeInstaller: (items?: [string, ComponentOptionsMixin][]) => Plugin;
export default makeInstaller;
