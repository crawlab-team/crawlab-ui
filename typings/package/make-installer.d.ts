import { ComponentOptionsMixin, Plugin } from 'vue';
import 'normalize.css/normalize.css';
import 'element-plus/theme-chalk/index.css';
import '../../src/styles/index.css';
declare const makeInstaller: (items?: [string, ComponentOptionsMixin][]) => Plugin;
export default makeInstaller;
