import { App } from 'vue';
import * as THREE from 'three';

declare global {
  interface Window {
    VITE_APP_API_BASE_URL?: string;
    threeJSApp?: any;
    initCanvas?: () => void;
    resetCanvas?: () => void;
    disposeCanvas?: () => void;
    _hmt?: Array;
    'vue3-sfc-loader'?: { loadModule };
    _app?: App;
    _t?: (path: string, args?: any) => string;
    _tc?: (path: string, c: number, args?: any) => string;
    _tp?: (pluginName: string, path: string) => string;
    THREE?: THREE;
  }
}
