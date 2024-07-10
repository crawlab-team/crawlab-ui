import { App } from 'vue';
import 'normalize.css/normalize.css';
import 'element-plus/theme-chalk/index.css';
import '@/styles/index.scss';
export declare const getDefaultCreateAppOptions: () => CreateAppOptions;
export declare const normalizeOptions: (options: CreateAppOptions) => CreateAppOptions;
declare const _createApp: (options?: CreateAppOptions) => Promise<App>;
export default _createApp;
