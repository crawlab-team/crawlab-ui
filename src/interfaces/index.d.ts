declare module '*.js';
declare module '*.jpg';
declare module '*.png';
declare module '*.svg';

export declare global {
  type ElFormValidator = (rule: any, value: any, callback: any) => void;

  interface ElFormRule {
    required: boolean;
    trigger: string;
    validator: ElFormValidator;
  }
}

// export modules interfaces.
export * from './common';
export * from './components';
export * from './views';
export * from './directives';
export * from './element';
export * from './i18n';
export * from './layout';
export * from './models';
export * from './router';
export * from './package';
export * from './services';
export * from './store';
